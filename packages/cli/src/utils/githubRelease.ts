import { spawn } from "child_process";
import { getChangelogEntry } from "@changesets/release-utils";
import fs from "fs";
import path from "path";
import { error, log } from "@changesets/logger";

export async function createGithubReleaseWithGh({
  pkgDir,
  pkgName,
  pkgVersion,
  tagName,
}: {
  pkgDir: string;
  pkgName: string;
  pkgVersion: string;
  tagName: string;
}) {
  await checkGhCli();
  const { repoOwner, repoName } = await getGithubRepoInfo(pkgDir);
  const changelogPath = path.join(pkgDir, "CHANGELOG.md");

  try {
    const changelog = await fs.promises.readFile(changelogPath, "utf-8");
    let changelogEntry = getChangelogEntry(changelog, pkgVersion);
    if (!changelogEntry) {
      // we can find a changelog but not the entry for this version
      // if this is true, something has probably gone wrong
      throw new Error(`Could not find changelog entry for ${tagName}`);
    }

    const releaseTitle = `${pkgName}@${pkgVersion}`;

    // https://cli.github.com/manual/gh_release_create
    await execAsync(
      "gh",
      [
        "release",
        "create",
        tagName,
        "--notes-file",
        "-",
        "--title",
        releaseTitle,
        "--repo",
        `${repoOwner}/${repoName}`,
        ...(pkgVersion.includes("-") ? ["-p"] : []),
      ],
      {
        stdin: changelogEntry.content,

        onOutput: (stdout, stderr) => {
          if (stdout) {
            log(stdout.trim());
          }
          if (stderr) {
            log(stderr.trim());
          }
        },
      }
    );

    log(`Release created for ${pkgName}@${pkgVersion}`);
  } catch (err) {
    error(`Failed to create release for ${pkgName}@${pkgVersion}`);
    throw err;
  }
}
export function execAsync(
  command: string,
  args: string[] = [],
  options: {
    cwd?: string;
    env?: any;
    stdin?: string;
    onOutput?: (stdout: string, stderr: string) => void;
  } = {}
): Promise<string> {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      shell: true,
      env: { ...process.env, ...(options.env || {}) },
      cwd: options.cwd,
    });

    let stdout = "";
    let stderr = "";

    child.stdout.on("data", (data) => {
      const str = data.toString();
      stdout += str;
      if (options.onOutput) {
        options.onOutput(str, "");
      }
    });

    child.stderr.on("data", (data) => {
      const str = data.toString();
      stderr += str;
      if (options.onOutput) {
        options.onOutput("", str);
      }
    });

    if (options.stdin) {
      child.stdin.write(options.stdin);
      child.stdin.end();
    }

    child.on("close", (code) => {
      if (code === 0) {
        resolve(stdout.trim());
      } else {
        const error = new Error(
          `Command failed: ${command} ${args.join(" ")}\n${stderr.trim()}`
        );
        (error as any).code = code;
        reject(error);
      }
    });

    child.on("error", (err) => {
      reject(err);
    });
  });
}

export async function checkGhCli() {
  try {
    await execAsync("gh", ["--version"]);
  } catch {
    throw new Error(
      "`gh` CLI is not installed. Please install it from https://github.com/cli/cli."
    );
  }

  try {
    await execAsync("gh", ["auth", "status"]);
  } catch {
    throw new Error(
      "You are not logged into the `gh` CLI. Please run `gh auth login` to authenticate."
    );
  }
}

export async function getGithubRepoInfo(cwd?: string) {
  try {
    const remoteUrl = await execAsync("git", ["remote", "get-url", "origin"], {
      cwd,
    });

    // Handle SSH format: git@github.com:owner/repo.git
    // Handle HTTPS format: https://github.com/owner/repo.git
    const match = remoteUrl.match(/(?:github\.com[:/])([^/]+)\/([^/]+)/);

    if (!match) {
      throw new Error(
        "Could not parse GitHub repository info from git remote URL"
      );
    }

    const [, repoOwner, repoName] = match;
    return { repoOwner, repoName: repoName.replace(/\.git$/, "") };
  } catch (err) {
    throw new Error(
      "Failed to get GitHub repository info. Ensure you are in a git repository with a GitHub remote."
    );
  }
}
