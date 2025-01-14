import { read } from "@changesets/config";
import { ExitError } from "@changesets/errors";
import { getDependentsGraph } from "@changesets/get-dependents-graph";
import { error } from "@changesets/logger";
import { shouldSkipPackage } from "@changesets/should-skip-package";
import { Config } from "@changesets/types";
import { getPackages } from "@changesets/get-packages";
import fs from "fs-extra";
import path from "path";
import add from "./commands/add";
import init from "./commands/init";
import pre from "./commands/pre";
import publish from "./commands/publish";
import status from "./commands/status";
import tagCommand from "./commands/tag";
import version from "./commands/version";
import { CliOptions } from "./types";

export async function run(
  input: string[],
  flags: { [name: string]: any },
  cwd: string
) {
  if (input[0] === "init") {
    await init(cwd);
    return;
  }

  if (!fs.existsSync(path.resolve(cwd, ".changeset"))) {
    error("There is no .changeset folder. ");
    error(
      "If this is the first time `changesets` have been used in this project, run `yarn changeset init` to get set up."
    );
    error(
      "If you expected there to be changesets, you should check git history for when the folder was removed to ensure you do not lose any configuration."
    );
    throw new ExitError(1);
  }

  const packages = await getPackages(cwd);

  let config: Config;
  try {
    config = await read(cwd, packages);
  } catch (e) {
    let oldConfigExists = await fs.pathExists(
      path.resolve(cwd, ".changeset/config.js")
    );
    if (oldConfigExists) {
      error(
        "It looks like you're using the version 1 `.changeset/config.js` file"
      );
      error("You'll need to convert it to a `.changeset/config.json` file");
      error(
        "The format of the config object has significantly changed in v2 as well"
      );
      error(
        " - we thoroughly recommend looking at the changelog for this package for what has changed"
      );
      throw new ExitError(1);
    } else {
      throw e;
    }
  }

  if (input.length < 1) {
    const { empty, open }: CliOptions = flags;
    // @ts-ignore if this is undefined, we have already exited
    await add(cwd, { empty, open }, config);
  } else if (input[0] !== "pre" && input.length > 1) {
    error(
      "Too many arguments passed to changesets - we only accept the command name as an argument"
    );
  } else {
    const {
      sinceMaster,
      since,
      verbose,
      output,
      otp,
      empty,
      ignore,
      snapshot,
      snapshotPrereleaseTemplate,
      tag,
      open,
      gitTag,
    }: CliOptions = flags;
    const deadFlags = ["updateChangelog", "isPublic", "skipCI", "commit"];

    deadFlags.forEach((flag) => {
      if (flags[flag]) {
        error(
          `the flag ${flag} has been removed from changesets for version 2`
        );
        error(`Please encode the desired value into your config`);
        error(`See our changelog for more details`);
        throw new ExitError(1);
      }
    });

    // Command line options need to be undefined, otherwise their
    // default value overrides the user's provided config in their
    // config file. For this reason, we only assign them to this
    // object as and when they exist.

    switch (input[0]) {
      case "add": {
        await add(cwd, { empty, open }, config);
        return;
      }
      case "version": {
        let ignoreArrayFromCmd: undefined | string[];
        if (typeof ignore === "string") {
          ignoreArrayFromCmd = [ignore];
        } else {
          // undefined or an array
          ignoreArrayFromCmd = ignore;
        }

        // Validate that items in ignoreArrayFromCmd are valid project names
        let pkgNames = new Set(
          packages.packages.map(({ packageJson }) => packageJson.name)
        );

        const messages = [];
        for (const pkgName of ignoreArrayFromCmd || []) {
          if (!pkgNames.has(pkgName)) {
            messages.push(
              `The package "${pkgName}" is passed to the \`--ignore\` option but it is not found in the project. You may have misspelled the package name.`
            );
          }
        }

        if (config.ignore.length > 0 && ignoreArrayFromCmd) {
          messages.push(
            `It looks like you are trying to use the \`--ignore\` option while ignore is defined in the config file. This is currently not allowed, you can only use one of them at a time.`
          );
        } else if (ignoreArrayFromCmd) {
          // use the ignore flags from cli
          config.ignore = ignoreArrayFromCmd;
        }

        const packagesByName = new Map(
          packages.packages.map((x) => [x.packageJson.name, x])
        );

        // validate that all dependents of skipped packages are also skipped
        const dependentsGraph = getDependentsGraph(packages, {
          ignoreDevDependencies: true,
          bumpVersionsWithWorkspaceProtocolOnly:
            config.bumpVersionsWithWorkspaceProtocolOnly,
        });
        for (const pkg of packages.packages) {
          if (
            !shouldSkipPackage(pkg, {
              ignore: config.ignore,
              allowPrivatePackages: config.privatePackages.version,
            })
          ) {
            continue;
          }
          const skippedPackage = pkg.packageJson.name;
          const dependents = dependentsGraph.get(skippedPackage) || [];
          for (const dependent of dependents) {
            const dependentPkg = packagesByName.get(dependent)!;
            if (
              !shouldSkipPackage(dependentPkg, {
                ignore: config.ignore,
                allowPrivatePackages: config.privatePackages.version,
              })
            ) {
              messages.push(
                `The package "${dependent}" depends on the skipped package "${skippedPackage}" (either by \`ignore\` option or by \`privatePackages.version\`), but "${dependent}" is not being skipped. Please pass "${dependent}" to the \`--ignore\` flag.`
              );
            }
          }
        }

        if (messages.length > 0) {
          error(messages.join("\n"));

          throw new ExitError(1);
        }

        if (snapshotPrereleaseTemplate) {
          config.snapshot.prereleaseTemplate = snapshotPrereleaseTemplate;
        }

        await version(cwd, { snapshot }, config);
        return;
      }
      case "publish": {
        await publish(cwd, { otp, tag, gitTag }, config);
        return;
      }
      case "status": {
        await status(cwd, { sinceMaster, since, verbose, output }, config);
        return;
      }
      case "tag": {
        await tagCommand(cwd, config);
        return;
      }
      case "pre": {
        let command = input[1];
        if (command !== "enter" && command !== "exit") {
          error(
            "`enter`, `exit` or `snapshot` must be passed after prerelease"
          );
          throw new ExitError(1);
        }
        let tag = input[2];
        if (command === "enter" && typeof tag !== "string") {
          error(`A tag must be passed when using prerelese enter`);
          throw new ExitError(1);
        }
        // @ts-ignore
        await pre(cwd, { command, tag });
        return;
      }
      case "bump": {
        error(
          'In version 2 of changesets, "bump" has been renamed to "version" - see our changelog for an explanation'
        );
        error(
          "To fix this, use `changeset version` instead, and update any scripts that use changesets"
        );
        throw new ExitError(1);
      }
      case "release": {
        error(
          'In version 2 of changesets, "release" has been renamed to "publish" - see our changelog for an explanation'
        );
        error(
          "To fix this, use `changeset publish` instead, and update any scripts that use changesets"
        );
        throw new ExitError(1);
      }
      default: {
        error(`Invalid command ${input[0]} was provided`);
        throw new ExitError(1);
      }
    }
  }
}
