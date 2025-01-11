import publishPackages, { PublishedResult } from "./publishPackages";
import { ExitError } from "@changesets/errors";
import { error, log, success, warn } from "@changesets/logger";
import * as git from "@changesets/git";
import { readPreState } from "@changesets/pre";
import { Config, PreState } from "@changesets/types";
import { getPackages } from "@changesets/get-packages";
import pc from "picocolors";
import { getUntaggedPackages } from "../../utils/getUntaggedPackages";

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

    if (gitTag) {
      // We create the tags after the push above so that we know that HEAD won't change and that pushing
      // won't suffer from a race condition if another merge happens in the mean time (pushing tags won't
      // fail if we are behind the base branch).
      log(`Creating git tag${successfulNpmPublishes.length > 1 ? "s" : ""}...`);

      await tagPublish(tool, successfulNpmPublishes, cwd);
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

async function tagPublish(
  tool: string,
  packageReleases: PublishedResult[],
  cwd: string
) {
  if (tool !== "root") {
    for (const pkg of packageReleases) {
      const tag = `${pkg.name}@${pkg.newVersion}`;
      log("New tag: ", tag);
      await git.tag(tag, cwd);
    }
  } else {
    const tag = `v${packageReleases[0].newVersion}`;
    log("New tag: ", tag);
    await git.tag(tag, cwd);
  }
}
