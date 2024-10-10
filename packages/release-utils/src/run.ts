import { getPackages, Package } from "@manypkg/get-packages";
import path from "path";
import semverLt from "semver/functions/lt.js";
import {
  execWithOutput,
  getVersionsByDirectory,
  getChangedPackages,
} from "./utils.ts";
import * as gitUtils from "./gitUtils.ts";
import { readChangesetState } from "./readChangesetState.ts";

type PublishOptions = {
  script: string;
  cwd?: string;
};

type PublishedPackage = { name: string; version: string };

type PublishResult =
  | {
      published: true;
      publishedPackages: PublishedPackage[];
    }
  | {
      published: false;
    };

export async function runPublish({
  script,
  cwd = process.cwd(),
}: PublishOptions): Promise<PublishResult> {
  let branch = await gitUtils.getCurrentBranch(cwd);
  let [publishCommand, ...publishArgs] = script.split(/\s+/);

  let changesetPublishOutput = await execWithOutput(
    publishCommand,
    publishArgs,
    { cwd }
  );

  await gitUtils.pullBranch(branch, cwd);
  await gitUtils.push(branch, { includeTags: true, cwd });

  let { packages, tool } = await getPackages(cwd);
  let releasedPackages: Package[] = [];

  if (tool !== "root") {
    let newTagRegex = /New tag:\s+(@[^/]+\/[^@]+|[^/]+)@([^\s]+)/;
    let packagesByName = new Map(packages.map((x) => [x.packageJson.name, x]));

    for (let line of changesetPublishOutput.stdout.split("\n")) {
      let match = line.match(newTagRegex);
      if (match === null) {
        continue;
      }
      let pkgName = match[1];
      let pkg = packagesByName.get(pkgName);
      if (pkg === undefined) {
        throw new Error(
          `Package "${pkgName}" not found.` +
            "This is probably a bug in the action, please open an issue"
        );
      }
      releasedPackages.push(pkg);
    }
  } else {
    if (packages.length === 0) {
      throw new Error(
        `No package found.` +
          "This is probably a bug in the action, please open an issue"
      );
    }
    let pkg = packages[0];
    let newTagRegex = /New tag:/;

    for (let line of changesetPublishOutput.stdout.split("\n")) {
      let match = line.match(newTagRegex);

      if (match) {
        releasedPackages.push(pkg);
        break;
      }
    }
  }

  if (releasedPackages.length) {
    return {
      published: true,
      publishedPackages: releasedPackages.map((pkg) => ({
        name: pkg.packageJson.name,
        version: pkg.packageJson.version,
      })),
    };
  }

  return { published: false };
}

type VersionOptions = {
  script?: string;
  cwd?: string;
  commitMessage?: string;
};

export async function runVersion({
  script,
  cwd = process.cwd(),
  commitMessage = "Version Packages",
}: VersionOptions) {
  let branch = await gitUtils.getCurrentBranch(cwd);
  let versionBranch = `changeset-release/${branch}`;
  let { preState } = await readChangesetState(cwd);

  await gitUtils.switchToMaybeExistingBranch(versionBranch, cwd);
  await gitUtils.reset("HEAD", undefined, cwd);

  let versionsByDirectory = await getVersionsByDirectory(cwd);

  if (script) {
    let [versionCommand, ...versionArgs] = script.split(/\s+/);
    await execWithOutput(versionCommand, versionArgs, { cwd });
  } else {
    let changesetsCliPkgJson = await require(path.join(
      cwd,
      "node_modules",
      "@changesets",
      "cli",
      "package.json"
    ));
    let cmd = semverLt(changesetsCliPkgJson.version, "2.0.0")
      ? "bump"
      : "version";
    await execWithOutput(
      "node",
      ["./node_modules/@changesets/cli/bin.js", cmd],
      { cwd }
    );
  }

  let changedPackages = await getChangedPackages(cwd, versionsByDirectory);

  // project with `commit: true` setting could have already committed files
  if (!(await gitUtils.checkIfClean(cwd))) {
    const finalCommitMessage = `${commitMessage}${
      preState ? ` (${preState.tag})` : ""
    }`;
    await gitUtils.commitAll(finalCommitMessage, cwd);
  }

  await gitUtils.push(versionBranch, { force: true, cwd });
  return { versionBranch, changedPackages };
}
