import publishPackages, { PublishedResult } from "./publishPackages";
import { ExitError } from "@changesets/errors";
import { error, info, log, success, warn } from "@changesets/logger";
import * as git from "@changesets/git";
import { readPreState } from "@changesets/pre";
import { Config, PreState } from "@changesets/types";
import { getPackages } from "@manypkg/get-packages";
import pc from "picocolors";
import { getUntaggedPackages } from "../../utils/getUntaggedPackages";
import {
  checkGhCli,
  createGithubReleaseWithGh,
} from "../../utils/githubRelease";

function logReleases(pkgs: Array<{ name: string; newVersion: string }>) {
  const mappedPkgs = pkgs.map((p) => `${p.name}@${p.newVersion}`).join("\n");
  log(mappedPkgs);
}

let importantSeparator = pc.red(
  "===============================IMPORTANT!==============================="
);

let importantEnd = pc.red(
  "----------------------------------------------------------------------"
);

function showNonLatestTagWarning(tag?: string, preState?: PreState) {
  warn(importantSeparator);
  if (preState) {
    warn(
      `You are in prerelease mode so packages will be published to the ${pc.cyan(
        preState.tag
      )}
        dist tag except for packages that have not had normal releases which will be published to ${pc.cyan(
          "latest"
        )}`
    );
  } else if (tag !== "latest") {
    warn(`Packages will be released under the ${tag} tag`);
  }
  warn(importantEnd);
}

export default async function publish(
  cwd: string,
  { otp, tag, gitTag = true }: { otp?: string; tag?: string; gitTag?: boolean },
  config: Config
) {
  if (gitTag && config.githubRelease) {
    // check gh is installed if githubRelease is enabled before publishing, so user can fix the issue before publishing
    await checkGhCli().catch((e) => {
      error(e.message);
      throw new ExitError(1);
    });
  }
  const releaseTag = tag && tag.length > 0 ? tag : undefined;
  let preState = await readPreState(cwd);

  if (releaseTag && preState && preState.mode === "pre") {
    error("Releasing under custom tag is not allowed in pre mode");
    log("To resolve this exit the pre mode by running `changeset pre exit`");
    throw new ExitError(1);
  }

  if (releaseTag || preState) {
    showNonLatestTagWarning(tag, preState);
  }

  const { packages, tool } = await getPackages(cwd);

  const tagPrivatePackages =
    config.privatePackages && config.privatePackages.tag;
  const publishedPackages = await publishPackages({
    packages,
    // if not public, we won't pass the access, and it works as normal
    access: config.access,
    otp,
    preState,
    tag: releaseTag,
  });
  const privatePackages = packages.filter(
    (pkg) => pkg.packageJson.private && pkg.packageJson.version
  );
  const untaggedPrivatePackageReleases = tagPrivatePackages
    ? await getUntaggedPackages(privatePackages, cwd, tool)
    : [];

  if (
    publishedPackages.length === 0 &&
    untaggedPrivatePackageReleases.length === 0
  ) {
    warn("No unpublished projects to publish");
  }

  const successfulNpmPublishes = publishedPackages.filter((p) => p.published);
  const unsuccessfulNpmPublishes = publishedPackages.filter(
    (p) => !p.published
  );

  if (successfulNpmPublishes.length > 0) {
    success("packages published successfully:");
    logReleases(successfulNpmPublishes);

    // Skip tag creation if GitHub releases are enabled, since GitHub will create the tags automatically.
    // Creating tags locally would cause push errors due to tag conflicts.
    if (!config.githubRelease && gitTag) {
      // We create the tags after the push above so that we know that HEAD won't change and that pushing
      // won't suffer from a race condition if another merge happens in the mean time (pushing tags won't
      // fail if we are behind the base branch).
      log(`Creating git tag${successfulNpmPublishes.length > 1 ? "s" : ""}...`);

      await tagPublish(tool, successfulNpmPublishes, cwd);
    }
  }

  if (config.githubRelease) {
    for (const pkg of packages) {
      const published = publishedPackages.find(
        (y) => y.name === pkg.packageJson.name
      );
      if (!published) {
        continue;
      }

      const tagName = getTagName(tool, published);
      info(`Creating GitHub release for ${tagName}...`);
      try {
        await createGithubReleaseWithGh({
          pkgDir: pkg.dir,
          pkgName: published.name,
          pkgVersion: published.newVersion,
          tagName,
        });
      } catch (err: any) {
        error(`Failed to create GitHub release for ${tagName}: ${err.message}`);
        throw new ExitError(1);
      }
    }
  }

  if (untaggedPrivatePackageReleases.length > 0) {
    success("found untagged projects:");
    logReleases(untaggedPrivatePackageReleases);
    await tagPublish(tool, untaggedPrivatePackageReleases, cwd);
  }
  if (unsuccessfulNpmPublishes.length > 0) {
    error("packages failed to publish:");

    logReleases(unsuccessfulNpmPublishes);
    throw new ExitError(1);
  }
}

function getTagName(tool: string, pkg: PublishedResult): string {
  if (tool !== "root") {
    return `${pkg.name}@${pkg.newVersion}`;
  }
  return `v${pkg.newVersion}`;
}

async function tagPublish(
  tool: string,
  packageReleases: PublishedResult[],
  cwd: string
) {
  if (tool !== "root") {
    for (const pkg of packageReleases) {
      const tag = getTagName(tool, pkg);
      log("New tag: ", tag);
      await git.tag(tag, cwd);
    }
  } else {
    const tag = getTagName(tool, packageReleases[0]);
    log("New tag: ", tag);
    await git.tag(tag, cwd);
  }
}
