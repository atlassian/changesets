import publishPackages from "./publishPackages";
import { ExitError } from "@changesets/errors";
import { error, log, success, warn } from "@changesets/logger";
import * as git from "@changesets/git";
import { readPreState } from "@changesets/pre";
import { Config, PreState, PrivatePackages } from "@changesets/types";
import { getPackages } from "@manypkg/get-packages";
import chalk from "chalk";

function logReleases(pkgs: Array<{ name: string; newVersion: string }>) {
  const mappedPkgs = pkgs.map((p) => `${p.name}@${p.newVersion}`).join("\n");
  log(mappedPkgs);
}

let importantSeparator = chalk.red(
  "===============================IMPORTANT!==============================="
);

let importantEnd = chalk.red(
  "----------------------------------------------------------------------"
);

function showNonLatestTagWarning(tag?: string, preState?: PreState) {
  warn(importantSeparator);
  if (preState) {
    warn(
      `You are in prerelease mode so packages will be published to the ${chalk.cyan(
        preState.tag
      )}
        dist tag except for packages that have not had normal releases which will be published to ${chalk.cyan(
          "latest"
        )}`
    );
  } else if (tag !== "latest") {
    warn(`Packages will be released under the ${tag} tag`);
  }
  warn(importantEnd);
}

export default async function run(
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

  const response = await publishPackages({
    packages,
    // if not public, we won't pass the access, and it works as normal
    access: config.access,
    otp,
    preState,
    tag: releaseTag,
    tagPrivatePackages: isFlagEnabled(
      config.privatePackages,
      PrivatePackages.Tag
    )
  });

  const successfulNpmPublishes = response.publishedPackages.filter(
    (p) => p.published
  );
  const unsuccessfulNpmPublishes = response.publishedPackages.filter(
    (p) => !p.published
  );
  const untaggedPrivatePackages = response.untaggedPrivatePackages;

  if (successfulNpmPublishes.length > 0) {
    success("packages published successfully:");
    logReleases(successfulNpmPublishes);

    if (gitTag) {
      // We create the tags after the push above so that we know that HEAD won't change and that pushing
      // won't suffer from a race condition if another merge happens in the mean time (pushing tags won't
      // fail if we are behind the base branch).
      log(`Creating git tag${successfulNpmPublishes.length > 1 ? "s" : ""}...`);
      if (tool !== "root") {
        for (const pkg of successfulNpmPublishes) {
          const tag = `${pkg.name}@${pkg.newVersion}`;
          log("New tag: ", tag);
          await git.tag(tag, cwd);
        }
      } else {
        const tag = `v${successfulNpmPublishes[0].newVersion}`;
        log("New tag: ", tag);
        await git.tag(tag, cwd);
      }
    }
  }

  if (untaggedPrivatePackages.length > 0) {
    success("found untagged projects:");
    logReleases(untaggedPrivatePackages);

    if (tool !== "root") {
      for (const pkg of untaggedPrivatePackages) {
        const tag = `${pkg.name}@${pkg.newVersion}`;
        log("New tag: ", tag);
        await git.tag(tag, cwd);
      }
    } else {
      const tag = `v${untaggedPrivatePackages[0].newVersion}`;
      log("New tag: ", tag);
      await git.tag(tag, cwd);
    }
  }

  if (unsuccessfulNpmPublishes.length > 0) {
    error("packages failed to publish:");

    logReleases(unsuccessfulNpmPublishes);
    throw new ExitError(1);
  }
}

function isFlagEnabled(value: number, tag: number): boolean {
  return (value & tag) === tag;
}
