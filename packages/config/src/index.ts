import * as fs from "fs-extra";
import path from "path";
import { ValidationError } from "@changesets/errors";
import { warn } from "@changesets/logger";
import { Packages } from "@manypkg/get-packages";
import { Config, WrittenConfig } from "@changesets/types";
import packageJson from "../package.json";

export let defaultWrittenConfig = {
  $schema: `https://unpkg.com/@changesets/config@${packageJson.version}/schema.json`,
  changelog: "@changesets/cli/changelog",
  commit: false,
  linked: [] as ReadonlyArray<ReadonlyArray<string>>,
  access: "restricted",
  baseBranch: "master",
  updateInternalDependencies: "patch"
} as const;

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

export let read = async (cwd: string, packages: Packages) => {
  let json = await fs.readJSON(path.join(cwd, ".changeset", "config.json"));
  return parse(json, packages);
};

export let parse = (json: WrittenConfig, packages: Packages): Config => {
  let messages = [];
  if (
    json.changelog !== undefined &&
    json.changelog !== false &&
    typeof json.changelog !== "string" &&
    !(
      Array.isArray(json.changelog) &&
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
        Array.isArray(json.linked) &&
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
      let pkgNames = new Set(
        packages.packages.map(({ packageJson }) => packageJson.name)
      );
      let foundPkgNames = new Set<string>();
      let duplicatedPkgNames = new Set<string>();
      for (let linkedGroup of json.linked) {
        for (let linkedPkgName of linkedGroup) {
          if (!pkgNames.has(linkedPkgName)) {
            messages.push(
              `The package "${linkedPkgName}" is specified in the \`linked\` option but it is not found in the project. You may have misspelled the package name.`
            );
          }
          if (foundPkgNames.has(linkedPkgName)) {
            duplicatedPkgNames.add(linkedPkgName);
          }
          foundPkgNames.add(linkedPkgName);
        }
      }
      if (duplicatedPkgNames.size) {
        duplicatedPkgNames.forEach(pkgName => {
          messages.push(
            `The package "${pkgName}" is in multiple sets of linked packages. Packages can only be in a single set of linked packages.`
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
      json.linked === undefined ? defaultWrittenConfig.linked : json.linked,
    baseBranch:
      json.baseBranch === undefined
        ? defaultWrittenConfig.baseBranch
        : json.baseBranch,
    packageLifecycleCommands:
      json.packageLifecycleCommands === undefined
        ? defaultWrittenConfig.packageLifecycleCommands
        : json.packageLifecycleCommands,
    updateInternalDependencies:
      json.updateInternalDependencies === undefined
        ? defaultWrittenConfig.updateInternalDependencies
        : json.updateInternalDependencies
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
