import * as fs from "fs-extra";
import path from "path";
import micromatch from "micromatch";
import { ValidationError } from "@changesets/errors";
import { warn } from "@changesets/logger";
import { Packages } from "@manypkg/get-packages";
import { Config, WrittenConfig } from "@changesets/types";
import packageJson from "../package.json";
import { getDependentsGraph } from "@changesets/get-dependents-graph";

type MakeSureThatSchemaDescribesAllProperties<
  T extends WrittenConfig,
  Schema = typeof import("../schema.json")["properties"]
> = {
  [K in keyof T]: K extends keyof Schema
    ? T[K]
    : "This property is missing a definition in the schema";
};

type DefaultWrittenConfig = MakeSureThatSchemaDescribesAllProperties<
  Required<
    Omit<WrittenConfig, "___experimentalUnsafeOptions_WILL_CHANGE_IN_PATCH">
  >
> & { $schema: string };

export let defaultWrittenConfig: DefaultWrittenConfig = {
  $schema: `https://unpkg.com/@changesets/config@${packageJson.version}/schema.json`,
  changelog: "@changesets/cli/changelog",
  commit: false,
  linked: [],
  access: "restricted",
  baseBranch: "master",
  updateInternalDependencies: "patch",
  bumpVersionsWithWorkspaceProtocolOnly: false,
  ignore: []
};

function getNormalisedChangelogOption(
  thing: false | readonly [string, any] | string
): Config["changelog"] {
  if (thing === false) {
    return false;
  }
  if (typeof thing === "string") {
    return [thing, null];
  }
  return thing;
}

function normalizePackageNames(
  listOfPackageNamesOrGlob: readonly string[],
  pkgNames: readonly string[]
): [string[], string[]] {
  const matchingPackages = micromatch(pkgNames, listOfPackageNamesOrGlob);

  // Go through the list of given package globs (again) in order to find out
  // which packages didn't match so that we can show a validation message.
  const nonExistingPackages = listOfPackageNamesOrGlob.filter(
    pkgNameOrGlob =>
      !pkgNames.some(pkgName => micromatch.isMatch(pkgName, pkgNameOrGlob))
  );

  // Since the validation happens in subsequent steps, we need to return a tuple
  // with the list of non-existing packages.
  // TODO: refactor the validation logic to exit early when something is not valid.
  return [matchingPackages, nonExistingPackages];
}

// TODO: replace usage with Array.isArray when TS 4.1 gets released
// source: https://github.com/microsoft/TypeScript/pull/39258/files#diff-a6b488d9bd802977827b535a3011c1f3R1379
function isArray<T>(
  arg: T | {}
): arg is T extends readonly any[]
  ? unknown extends T
    ? never
    : readonly any[]
  : any[] {
  return Array.isArray(arg);
}

export let read = async (cwd: string, packages: Packages) => {
  let json = await fs.readJSON(path.join(cwd, ".changeset", "config.json"));
  return parse(json, packages);
};

export let parse = (json: WrittenConfig, packages: Packages): Config => {
  let messages = [];
  let pkgNames: readonly string[] = packages.packages.map(
    ({ packageJson }) => packageJson.name
  );

  if (
    json.changelog !== undefined &&
    json.changelog !== false &&
    typeof json.changelog !== "string" &&
    !(
      isArray(json.changelog) &&
      json.changelog.length === 2 &&
      typeof json.changelog[0] === "string"
    )
  ) {
    messages.push(
      `The \`changelog\` option is set as ${JSON.stringify(
        json.changelog,
        null,
        2
      )} when the only valid values are undefined, a module path(e.g. "@changesets/cli/changelog" or "./some-module") or a tuple with a module path and config for the changelog generator(e.g. ["@changesets/cli/changelog", { someOption: true }])`
    );
  }

  let normalizedAccess: WrittenConfig["access"] = json.access;
  if ((json.access as string) === "private") {
    normalizedAccess = "restricted";
    warn(
      'The `access` option is set as "private", but this is actually not a valid value - the correct form is "restricted".'
    );
  }
  if (
    normalizedAccess !== undefined &&
    normalizedAccess !== "restricted" &&
    normalizedAccess !== "public"
  ) {
    messages.push(
      `The \`access\` option is set as ${JSON.stringify(
        normalizedAccess,
        null,
        2
      )} when the only valid values are undefined, "public" or "restricted"`
    );
  }

  if (json.commit !== undefined && typeof json.commit !== "boolean") {
    messages.push(
      `The \`commit\` option is set as ${JSON.stringify(
        json.commit,
        null,
        2
      )} when the only valid values are undefined or a boolean`
    );
  }
  if (json.baseBranch !== undefined && typeof json.baseBranch !== "string") {
    messages.push(
      `The \`baseBranch\` option is set as ${JSON.stringify(
        json.baseBranch,
        null,
        2
      )} but the \`baseBranch\` option can only be set as a string`
    );
  }
  if (json.linked !== undefined) {
    if (
      !(
        isArray(json.linked) &&
        json.linked.every(
          arr =>
            Array.isArray(arr) &&
            arr.every(pkgName => typeof pkgName === "string")
        )
      )
    ) {
      messages.push(
        `The \`linked\` option is set as ${JSON.stringify(
          json.linked,
          null,
          2
        )} when the only valid values are undefined or an array of arrays of package names`
      );
    } else {
      let foundPkgNames = new Set<string>();
      let duplicatedPkgNames = new Set<string>();
      for (let linkedGroup of json.linked) {
        let [
          normalizedLinkedGroup,
          nonExistingPackages
        ] = normalizePackageNames(linkedGroup, pkgNames);
        for (let linkedPkgName of normalizedLinkedGroup) {
          if (foundPkgNames.has(linkedPkgName)) {
            duplicatedPkgNames.add(linkedPkgName);
          }
          foundPkgNames.add(linkedPkgName);
        }
        // Show validation message for each non-existing package
        if (nonExistingPackages.length > 0) {
          nonExistingPackages.forEach(nonExistingPkgName => {
            messages.push(
              `The package or glob expression "${nonExistingPkgName}" specified in the \`linked\` option does not match any package in the project. You may have misspelled the package name or provided an invalid glob expression. Note that glob expressions must be defined according to https://www.npmjs.com/package/micromatch.`
            );
          });
        }
      }
      if (duplicatedPkgNames.size) {
        duplicatedPkgNames.forEach(pkgName => {
          messages.push(
            `The package "${pkgName}" is defined in multiple sets of linked packages. Packages can only be defined in a single set of linked packages. If you are using glob expressions, make sure that they are valid according to https://www.npmjs.com/package/micromatch.`
          );
        });
      }
    }
  }
  if (
    json.updateInternalDependencies !== undefined &&
    !["patch", "minor"].includes(json.updateInternalDependencies)
  ) {
    messages.push(
      `The \`updateInternalDependencies\` option is set as ${JSON.stringify(
        json.updateInternalDependencies,
        null,
        2
      )} but can only be 'patch' or 'minor'`
    );
  }
  if (json.ignore) {
    if (
      !(
        isArray(json.ignore) &&
        json.ignore.every(pkgName => typeof pkgName === "string")
      )
    ) {
      messages.push(
        `The \`ignore\` option is set as ${JSON.stringify(
          json.ignore,
          null,
          2
        )} when the only valid values are undefined or an array of package names`
      );
    } else {
      let [, nonExistingPackages] = normalizePackageNames(
        json.ignore,
        pkgNames
      );
      if (nonExistingPackages.length > 0) {
        nonExistingPackages.forEach(nonExistingPkgName => {
          messages.push(
            `The package or glob expression "${nonExistingPkgName}" is specified in the \`ignore\` option but it is not found in the project. You may have misspelled the package name or provided an invalid glob expression. Note that glob expressions must be defined according to https://www.npmjs.com/package/micromatch.`
          );
        });
      }

      // Validate that all dependents of ignored packages are listed in the ignore list
      const dependentsGraph = getDependentsGraph(packages);
      for (const ignoredPackage of json.ignore) {
        const dependents = dependentsGraph.get(ignoredPackage) || [];
        for (const dependent of dependents) {
          if (!json.ignore.includes(dependent)) {
            messages.push(
              `The package "${dependent}" depends on the ignored package "${ignoredPackage}", but "${dependent}" is not being ignored. Please add "${dependent}" to the \`ignore\` option.`
            );
          }
        }
      }
    }
  }

  if (json.___experimentalUnsafeOptions_WILL_CHANGE_IN_PATCH !== undefined) {
    const {
      onlyUpdatePeerDependentsWhenOutOfRange,
      updateInternalDependents,
      useCalculatedVersionForSnapshots
    } = json.___experimentalUnsafeOptions_WILL_CHANGE_IN_PATCH;
    if (
      onlyUpdatePeerDependentsWhenOutOfRange !== undefined &&
      typeof onlyUpdatePeerDependentsWhenOutOfRange !== "boolean"
    ) {
      messages.push(
        `The \`onlyUpdatePeerDependentsWhenOutOfRange\` option is set as ${JSON.stringify(
          onlyUpdatePeerDependentsWhenOutOfRange,
          null,
          2
        )} when the only valid values are undefined or a boolean`
      );
    }
    if (
      updateInternalDependents !== undefined &&
      !["always", "out-of-range"].includes(updateInternalDependents)
    ) {
      messages.push(
        `The \`updateInternalDependents\` option is set as ${JSON.stringify(
          updateInternalDependents,
          null,
          2
        )} but can only be 'always' or 'out-of-range'`
      );
    }
    if (
      useCalculatedVersionForSnapshots !== undefined &&
      typeof useCalculatedVersionForSnapshots !== "boolean"
    ) {
      messages.push(
        `The \`useCalculatedVersionForSnapshots\` option is set as ${JSON.stringify(
          useCalculatedVersionForSnapshots,
          null,
          2
        )} when the only valid values are undefined or a boolean`
      );
    }
  }
  if (messages.length) {
    throw new ValidationError(
      `Some errors occurred when validating the changesets config:\n` +
        messages.join("\n")
    );
  }

  let config: Config = {
    changelog: getNormalisedChangelogOption(
      json.changelog === undefined
        ? defaultWrittenConfig.changelog
        : json.changelog
    ),
    access:
      normalizedAccess === undefined
        ? defaultWrittenConfig.access
        : normalizedAccess,
    commit:
      json.commit === undefined ? defaultWrittenConfig.commit : json.commit,
    linked:
      json.linked === undefined
        ? defaultWrittenConfig.linked
        : json.linked.map(
            linkedGroup => normalizePackageNames(linkedGroup, pkgNames)[0]
          ),
    baseBranch:
      json.baseBranch === undefined
        ? defaultWrittenConfig.baseBranch
        : json.baseBranch,

    updateInternalDependencies:
      json.updateInternalDependencies === undefined
        ? defaultWrittenConfig.updateInternalDependencies
        : json.updateInternalDependencies,

    ignore:
      json.ignore === undefined
        ? defaultWrittenConfig.ignore
        : normalizePackageNames(json.ignore, pkgNames)[0],

    bumpVersionsWithWorkspaceProtocolOnly:
      json.bumpVersionsWithWorkspaceProtocolOnly === true,

    ___experimentalUnsafeOptions_WILL_CHANGE_IN_PATCH: {
      onlyUpdatePeerDependentsWhenOutOfRange:
        json.___experimentalUnsafeOptions_WILL_CHANGE_IN_PATCH === undefined ||
        json.___experimentalUnsafeOptions_WILL_CHANGE_IN_PATCH
          .onlyUpdatePeerDependentsWhenOutOfRange === undefined
          ? false
          : json.___experimentalUnsafeOptions_WILL_CHANGE_IN_PATCH
              .onlyUpdatePeerDependentsWhenOutOfRange,

      updateInternalDependents:
        json.___experimentalUnsafeOptions_WILL_CHANGE_IN_PATCH
          ?.updateInternalDependents ?? "out-of-range",

      useCalculatedVersionForSnapshots:
        json.___experimentalUnsafeOptions_WILL_CHANGE_IN_PATCH === undefined ||
        json.___experimentalUnsafeOptions_WILL_CHANGE_IN_PATCH
          .useCalculatedVersionForSnapshots === undefined
          ? false
          : json.___experimentalUnsafeOptions_WILL_CHANGE_IN_PATCH
              .useCalculatedVersionForSnapshots
    }
  };
  return config;
};

let fakePackage = {
  dir: "",
  packageJson: {
    name: "",
    version: ""
  }
};

export let defaultConfig = parse(defaultWrittenConfig, {
  root: fakePackage,
  tool: "root",
  packages: [fakePackage]
});
