import pc from "picocolors";
import fs from "node:fs/promises";
import path from "path";
import getReleasePlan from "@changesets/get-release-plan";
import { error, info, log, warn } from "@changesets/logger";
import {
  ComprehensiveRelease,
  Config,
  Release,
  VersionType,
} from "@changesets/types";
import { getVersionableChangedPackages } from "../../utils/versionablePackages.ts";

export default async function status(
  cwd: string,
  {
    sinceMaster,
    since,
    verbose,
    output,
  }: {
    sinceMaster?: boolean;
    since?: string;
    verbose?: boolean;
    output?: string;
  },
  config: Config
) {
  if (sinceMaster) {
    warn(
      "--sinceMaster is deprecated and will be removed in a future major version"
    );
    warn("Use --since=master instead");
  }
  const sinceBranch =
    since === undefined ? (sinceMaster ? "master" : undefined) : since;
  const releasePlan = await getReleasePlan(cwd, sinceBranch, config);
  const { changesets, releases } = releasePlan;
  const changedPackages = await getVersionableChangedPackages(config, {
    cwd,
    ref: sinceBranch,
  });

  if (changedPackages.length > 0 && changesets.length === 0) {
    error(
      "Some packages have been changed but no changesets were found. Run `changeset add` to resolve this error."
    );
    error(
      "If this change doesn't need a release, run `changeset add --empty`."
    );
    process.exit(1);
  }

  if (output) {
    await fs.writeFile(
      path.join(cwd, output),
      JSON.stringify(releasePlan, undefined, 2)
    );
    return;
  }

  const print = verbose ? verbosePrint : SimplePrint;
  print("patch", releases);
  log("---");
  print("minor", releases);
  log("---");
  print("major", releases);

  return releasePlan;
}

function SimplePrint(type: VersionType, releases: Array<Release>) {
  const packages = releases.filter((r) => r.type === type);
  if (packages.length) {
    info(`Packages to be bumped at ${pc.green(type)}:\n`);

    const pkgs = packages.map(({ name }) => `- ${name}`).join("\n");
    log(pc.green(pkgs));
  } else {
    info(`${pc.green("NO")} packages to be bumped at ${pc.green(type)}`);
  }
}

function verbosePrint(
  type: VersionType,
  releases: Array<ComprehensiveRelease>
) {
  const packages = releases.filter((r) => r.type === type);
  if (packages.length) {
    info(`Packages to be bumped at ${pc.green(type)}`);

    for (const { name, newVersion: version, changesets } of packages) {
      log(`- ${pc.green(name)} ${pc.cyan(version)}`);
      for (const c of changesets) {
        log(`  - ${pc.blue(`.changeset/${c}.md`)}`);
      }
    }
  } else {
    info(
      `Running release would release ${pc.red("NO")} packages as a ${pc.green(
        type
      )}`
    );
  }
}
