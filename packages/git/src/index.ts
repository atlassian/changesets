import spawn from "spawndamnit";
import fs from "fs";
import path from "path";
import { getPackages, Package } from "@manypkg/get-packages";
import { GitError } from "@changesets/errors";
import isSubdir from "is-subdir";
import { deprecate } from "util";

const isInDir = (dir: string) => (subdir: string) => isSubdir(dir, subdir);

async function add(pathToFile: string, cwd: string) {
  const gitCmd = await spawn("git", ["add", pathToFile], { cwd });

  if (gitCmd.code !== 0) {
    console.log(pathToFile, gitCmd.stderr.toString());
  }
  return gitCmd.code === 0;
}

async function commit(message: string, cwd: string) {
  const gitCmd = await spawn(
    "git",
    ["commit", "-m", message, "--allow-empty"],
    { cwd }
  );
  return gitCmd.code === 0;
}

async function getAllTags(cwd: string): Promise<Set<string>> {
  const gitCmd = await spawn("git", ["tag"], { cwd });

  if (gitCmd.code !== 0) {
    throw new Error(gitCmd.stderr.toString());
  }

  const tags = gitCmd.stdout
    .toString()
    .trim()
    .split("\n");

  return new Set(tags);
}

// used to create a single tag at a time for the current head only
async function tag(tagStr: string, cwd: string) {
  // NOTE: it's important we use the -m flag otherwise 'git push --follow-tags' won't actually push
  // the tags
  const gitCmd = await spawn("git", ["tag", tagStr, "-m", tagStr], { cwd });
  return gitCmd.code === 0;
}

// Find the commit where we diverged from `ref` at using `git merge-base`
export async function getDivergedCommit(cwd: string, ref: string) {
  const cmd = await spawn("git", ["merge-base", ref, "HEAD"], { cwd });
  if (cmd.code !== 0) {
    throw new Error(
      `Failed to find where HEAD diverged from ${ref}. Does ${ref} exist?`
    );
  }
  return cmd.stdout.toString().trim();
}

const getCommitThatAddsFile = deprecate(
  async (gitPath: string, cwd: string) => {
    return (await getCommitsThatAddFiles([gitPath], cwd))[0];
  },
  "Use the bulk getCommitsThatAddFiles function instead"
);

/**
 * Get the short SHAs for the commits that added files, including automatically
 * extending a shallow clone if necessary to determine any commits.
 * @param gitPaths - Paths to fetch
 * @param cwd - Location of the repository
 */
async function getCommitsThatAddFiles(
  gitPaths: string[],
  cwd: string
): Promise<(string | undefined)[]> {
  // Maps gitPath to short commit SHA
  const map = new Map<string, string>();

  // Paths we haven't completed processing on yet
  let remaining = gitPaths;

  do {
    // Fetch commit information for all paths we don't have yet
    const commitInfos = await Promise.all(remaining.map(findCommitAndParent));

    // To collect commits without parents (usually because they're absent from
    // a shallow clone).
    let commitsWithMissingParents = [];

    for (const info of commitInfos) {
      if (info.commitSha) {
        if (info.parentSha) {
          // We have found the parent of the commit that added the file.
          // Therefore we know that the commit is legitimate and isn't simply the boundary of a shallow clone.
          map.set(info.path, info.commitSha);
        } else {
          commitsWithMissingParents.push(info);
        }
      } else {
        // No commit for this file, which indicates it doesn't exist.
      }
    }

    if (commitsWithMissingParents.length === 0) {
      break;
    }

    // The commits we've found may be the real commits or they may be the boundary of
    // a shallow clone.

    // Can we deepen the clone?
    if (await isRepoShallow()) {
      // Yes.
      await deepenCloneBy(50);
      remaining = commitsWithMissingParents.map(p => p.path);
    } else {
      // It's not a shallow clone, so all the commit SHAs we have are legitimate.
      for (const unresolved of commitsWithMissingParents) {
        map.set(unresolved.path, unresolved.commitSha);
      }
      break;
    }
  } while (true);

  return gitPaths.map(p => map.get(p));

  /** Find the commit that added a file, and the parent of that commit */
  async function findCommitAndParent(gitPath: string) {
    const logResult = await spawn(
      "git",
      [
        "log",
        "--diff-filter=A",
        "--max-count=1",
        "--pretty=format:%h:%p",
        gitPath
      ],
      { cwd }
    );
    if (logResult.code !== 0) {
      throw new Error(logResult.stderr.toString());
    }
    const [commitSha, parentSha] = logResult.stdout.toString().split(":");
    return { path: gitPath, commitSha, parentSha };
  }

  async function isRepoShallow() {
    const gitCmd = await spawn(
      "git",
      ["rev-parse", "--is-shallow-repository"],
      { cwd }
    );
    if (gitCmd.code !== 0) {
      throw new Error(gitCmd.stderr.toString());
    }

    const isShallowRepoOutput = gitCmd.stdout.toString().trim();

    if (isShallowRepoOutput === "--is-shallow-repository") {
      // We have an old version of Git (<2.15) which doesn't support `rev-parse --is-shallow-repository`
      // In that case, we'll test for the existence of .git/shallow.

      // Firstly, find the .git folder for the repo; note that this will be relative to the repo dir
      const gitDirCmd = await spawn("git", ["rev-parse", "--git-dir"], { cwd });

      if (gitDirCmd.code !== 0) {
        throw new Error(gitDirCmd.stderr.toString());
      }

      const gitDir = gitDirCmd.stdout.toString().trim();

      const fullGitDir = path.resolve(cwd, gitDir);

      // Check for the existence of <gitDir>/shallow
      return fs.existsSync(path.join(fullGitDir, "shallow"));
    } else {
      // We have a newer Git which supports `rev-parse --is-shallow-repository`. We'll use
      // the output of that instead of messing with .git/shallow in case that changes in the future.
      return isShallowRepoOutput === "true";
    }
  }

  async function deepenCloneBy(by: number) {
    const cmd = await spawn("git", ["fetch", `--deepen=${by}`], { cwd });
    if (cmd.code !== 0) {
      throw new Error(cmd.stderr.toString());
    }
  }
}

async function getChangedFilesSince({
  cwd,
  ref,
  fullPath = false
}: {
  cwd: string;
  ref: string;
  fullPath?: boolean;
}): Promise<Array<string>> {
  const divergedAt = await getDivergedCommit(cwd, ref);
  // Now we can find which files we added
  const cmd = await spawn("git", ["diff", "--name-only", divergedAt], { cwd });
  if (cmd.code !== 0) {
    throw new Error(
      `Failed to diff against ${divergedAt}. Is ${divergedAt} a valid ref?`
    );
  }

  const files = cmd.stdout
    .toString()
    .trim()
    .split("\n")
    .filter(a => a);
  if (!fullPath) return files;
  return files.map(file => path.resolve(cwd, file));
}

// below are less generic functions that we use in combination with other things we are doing
async function getChangedChangesetFilesSinceRef({
  cwd,
  ref
}: {
  cwd: string;
  ref: string;
}): Promise<Array<string>> {
  try {
    const divergedAt = await getDivergedCommit(cwd, ref);
    // Now we can find which files we added
    const cmd = await spawn(
      "git",
      ["diff", "--name-only", "--diff-filter=d", divergedAt],
      {
        cwd
      }
    );

    let tester = /.changeset\/[^/]+\.md$/;

    const files = cmd.stdout
      .toString()
      .trim()
      .split("\n")
      .filter(file => tester.test(file));
    return files;
  } catch (err) {
    if (err instanceof GitError) return [];
    throw err;
  }
}

async function getChangedPackagesSinceRef({
  cwd,
  ref
}: {
  cwd: string;
  ref: string;
}) {
  const changedFiles = await getChangedFilesSince({ ref, cwd, fullPath: true });
  let packages = await getPackages(cwd);

  const fileToPackage: Record<string, Package> = {};

  packages.packages.forEach(pkg =>
    changedFiles.filter(isInDir(pkg.dir)).forEach(fileName => {
      const prevPkg = fileToPackage[fileName] || { dir: "" };
      if (pkg.dir.length > prevPkg.dir.length) fileToPackage[fileName] = pkg;
    })
  );

  return (
    Object.values(fileToPackage)
      // filter, so that we have only unique packages
      .filter((pkg, idx, packages) => packages.indexOf(pkg) === idx)
  );
}

export {
  getCommitThatAddsFile,
  getCommitsThatAddFiles,
  getChangedFilesSince,
  add,
  commit,
  tag,
  getChangedPackagesSinceRef,
  getChangedChangesetFilesSinceRef,
  getAllTags
};
