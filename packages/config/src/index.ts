import * as fs from "fs-extra";
import path from "path";
import micromatch from "micromatch";
import { ValidationError } from "@changesets/errors";
import { warn } from "@changesets/logger";
import { Packages, getPackages } from "@manypkg/get-packages";
import {
  Config,
  WrittenConfig,
  Fixed,
  Linked,
  PackageGroup,
} from "@changesets/types";
import packageJson from "../package.json";
import { getDependentsGraph } from "@changesets/get-dependents-graph";

export let defaultWrittenConfig = {
  $schema: `https://unpkg.com/@changesets/config@${packageJson.version}/schema.json`,
  changelog: "@changesets/cli/changelog",
  commit: false,
  fixed: [] as Fixed,
  linked: [] as Linked,
  access: "restricted",
  baseBranch: "master",
  updateInternalDependencies: "patch",
  ignore: [] as ReadonlyArray<string>,
} as const;

function flatten<T>(arr: Array<T[]>): T[] {
  return ([] as T[]).concat(...arr);
}

function getNormalizedChangelogOption(
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

function getNormalizedCommitOption(
  thing: boolean | readonly [string, any] | string
): Config["commit"] {
  if (thing === false) {
    return false;
  }
  if (thing === true) {
    return ["@changesets/cli/commit", { skipCI: "version" }];
  }
  if (typeof thing === "string") {
    return [thing, null];
  }
  return thing;
}

function getUnmatchedPatterns(
  listOfPackageNamesOrGlob: readonly string[],
  pkgNames: readonly string[]
): string[] {
  return listOfPackageNamesOrGlob.filter(
    (pkgNameOrGlob) =>
      !pkgNames.some((pkgName) => micromatch.isMatch(pkgName, pkgNameOrGlob))
  );
}

const havePackageGroupsCorrectShape = (
  pkgGroups: ReadonlyArray<PackageGroup>
) => {
  return (
    isArray(pkgGroups) &&
    pkgGroups.every(
      (arr) =>
        isArray(arr) && arr.every((pkgName) => typeof pkgName === "string")
    )
  );
};

// TODO: it might be possible to remove this if improvements to `Array.isArray` ever land
// related thread: github.com/microsoft/TypeScript/issues/36554
function isArray<T>(
  arg: T | {}
): arg is T extends readonly any[]
  ? unknown extends T
    ? never
    : readonly any[]
  : any[] {
  return Array.isArray(arg);
}

export let read = async (cwd: string, packages?: Packages) => {
  packages ??= await getPackages(cwd);
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
      )} when the only valid values are undefined, false, a module path(e.g. "@changesets/cli/changelog" or "./some-module") or a tuple with a module path and config for the changelog generator(e.g. ["@changesets/cli/changelog", { someOption: true }])`
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

  if (
    json.commit !== undefined &&
    typeof json.commit !== "boolean" &&
    typeof json.commit !== "string" &&
    !(
      isArray(json.commit) &&
      json.commit.length === 2 &&
      typeof json.commit[0] === "string"
    )
  ) {
    messages.push(
      `The \`commit\` option is set as ${JSON.stringify(
        json.commit,
        null,
        2
      )} when the only valid values are undefined or a boolean or a module path (e.g. "@changesets/cli/commit" or "./some-module") or a tuple with a module path and config for the commit message generator (e.g. ["@changesets/cli/commit", { "skipCI": "version" }])`
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

  if (
    json.changedFilePatterns !== undefined &&
    (!isArray(json.changedFilePatterns) ||
      !json.changedFilePatterns.every((pattern) => typeof pattern === "string"))
  ) {
    messages.push(
      `The \`changedFilePatterns\` option is set as ${JSON.stringify(
        json.changedFilePatterns,
        null,
        2
      )} but the \`changedFilePatterns\` option can only be set as an array of strings`
    );
  }

  let fixed: string[][] = [];
  if (json.fixed !== undefined) {
    if (!havePackageGroupsCorrectShape(json.fixed)) {
      messages.push(
        `The \`fixed\` option is set as ${JSON.stringify(
          json.fixed,
          null,
          2
        )} when the only valid values are undefined or an array of arrays of package names`
      );
    } else {
      let foundPkgNames = new Set<string>();
      let duplicatedPkgNames = new Set<string>();

      for (let fixedGroup of json.fixed) {
        messages.push(
          ...getUnmatchedPatterns(fixedGroup, pkgNames).map(
            (pkgOrGlob) =>
              `The package or glob expression "${pkgOrGlob}" specified in the \`fixed\` option does not match any package in the project. You may have misspelled the package name or provided an invalid glob expression. Note that glob expressions must be defined according to https://www.npmjs.com/package/micromatch.`
          )
        );

        let expandedFixedGroup = micromatch(pkgNames, fixedGroup);
        fixed.push(expandedFixedGroup);

        for (let fixedPkgName of expandedFixedGroup) {
          if (foundPkgNames.has(fixedPkgName)) {
            duplicatedPkgNames.add(fixedPkgName);
          }
          foundPkgNames.add(fixedPkgName);
        }
      }

      if (duplicatedPkgNames.size) {
        duplicatedPkgNames.forEach((pkgName) => {
          messages.push(
            `The package "${pkgName}" is defined in multiple sets of fixed packages. Packages can only be defined in a single set of fixed packages. If you are using glob expressions, make sure that they are valid according to https://www.npmjs.com/package/micromatch.`
          );
        });
      }
    }
  }

  let linked: string[][] = [];
  if (json.linked !== undefined) {
    if (!havePackageGroupsCorrectShape(json.linked)) {
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
        messages.push(
          ...getUnmatchedPatterns(linkedGroup, pkgNames).map(
            (pkgOrGlob) =>
              `The package or glob expression "${pkgOrGlob}" specified in the \`linked\` option does not match any package in the project. You may have misspelled the package name or provided an invalid glob expression. Note that glob expressions must be defined according to https://www.npmjs.com/package/micromatch.`
          )
        );

        let expandedLinkedGroup = micromatch(pkgNames, linkedGroup);
        linked.push(expandedLinkedGroup);

        for (let linkedPkgName of expandedLinkedGroup) {
          if (foundPkgNames.has(linkedPkgName)) {
            duplicatedPkgNames.add(linkedPkgName);
          }
          foundPkgNames.add(linkedPkgName);
        }
      }

      if (duplicatedPkgNames.size) {
        duplicatedPkgNames.forEach((pkgName) => {
          messages.push(
            `The package "${pkgName}" is defined in multiple sets of linked packages. Packages can only be defined in a single set of linked packages. If you are using glob expressions, make sure that they are valid according to https://www.npmjs.com/package/micromatch.`
          );
        });
      }
    }
  }

  const allFixedPackages = new Set(flatten(fixed));
  const allLinkedPackages = new Set(flatten(linked));

  allFixedPackages.forEach((pkgName) => {
    if (allLinkedPackages.has(pkgName)) {
      messages.push(
        `The package "${pkgName}" can be found in both fixed and linked groups. A package can only be either fixed or linked.`
      );
    }
  });

  if (
    json.updateInternalDependencies !== undefined &&
    !["patch", "minor", "major"].includes(json.updateInternalDependencies)
  ) {
    messages.push(
      `The \`updateInternalDependencies\` option is set as ${JSON.stringify(
        json.updateInternalDependencies,
        null,
        2
      )} but can only be 'patch', 'minor' or 'major'`
    );
  }
  if (json.ignore) {
    if (
      !(
        isArray(json.ignore) &&
        json.ignore.every((pkgName) => typeof pkgName === "string")
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
      messages.push(
        ...getUnmatchedPatterns(json.ignore, pkgNames).map(
          (pkgOrGlob) =>
            `The package or glob expression "${pkgOrGlob}" is specified in the \`ignore\` option but it is not found in the project. You may have misspelled the package name or provided an invalid glob expression. Note that glob expressions must be defined according to https://www.npmjs.com/package/micromatch.`
        )
      );

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

  const { snapshot } = json;

  if (snapshot !== undefined) {
    if (
      snapshot.useCalculatedVersion !== undefined &&
      typeof snapshot.useCalculatedVersion !== "boolean"
    ) {
      messages.push(
        `The \`snapshot.useCalculatedVersion\` option is set as ${JSON.stringify(
          snapshot.useCalculatedVersion,
          null,
          2
        )} when the only valid values are undefined or a boolean`
      );
    }
    if (
      snapshot.prereleaseTemplate !== undefined &&
      typeof snapshot.prereleaseTemplate !== "string"
    ) {
      messages.push(
        `The \`snapshot.prereleaseTemplate\` option is set as ${JSON.stringify(
          snapshot.prereleaseTemplate,
          null,
          2
        )} when the only valid values are undefined, or a template string.`
      );
    }
  }

  if (json.___experimentalUnsafeOptions_WILL_CHANGE_IN_PATCH !== undefined) {
    const {
      onlyUpdatePeerDependentsWhenOutOfRange,
      updateInternalDependents,
      useCalculatedVersionForSnapshots,
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
      useCalculatedVersionForSnapshots &&
      useCalculatedVersionForSnapshots !== undefined
    ) {
      console.warn(
        `Experimental flag "useCalculatedVersionForSnapshots" is deprecated since snapshot feature became stable. Please use "snapshot.useCalculatedVersion" instead.`
      );

      if (typeof useCalculatedVersionForSnapshots !== "boolean") {
        messages.push(
          `The \`useCalculatedVersionForSnapshots\` option is set as ${JSON.stringify(
            useCalculatedVersionForSnapshots,
            null,
            2
          )} when the only valid values are undefined or a boolean`
        );
      }
    }
  }

  if (messages.length) {
    throw new ValidationError(
      `Some errors occurred when validating the changesets config:\n` +
        messages.join("\n")
    );
  }

  let config: Config = {
    changelog: getNormalizedChangelogOption(
      json.changelog === undefined
        ? defaultWrittenConfig.changelog
        : json.changelog
    ),
    access:
      normalizedAccess === undefined
        ? defaultWrittenConfig.access
        : normalizedAccess,
    commit: getNormalizedCommitOption(
      json.commit === undefined ? defaultWrittenConfig.commit : json.commit
    ),
    fixed,
    linked,
    baseBranch:
      json.baseBranch === undefined
        ? defaultWrittenConfig.baseBranch
        : json.baseBranch,

    changedFilePatterns: json.changedFilePatterns ?? ["**"],

    updateInternalDependencies:
      json.updateInternalDependencies === undefined
        ? defaultWrittenConfig.updateInternalDependencies
        : json.updateInternalDependencies,

    ignore:
      json.ignore === undefined
        ? defaultWrittenConfig.ignore
        : micromatch(pkgNames, json.ignore),

    bumpVersionsWithWorkspaceProtocolOnly:
      json.bumpVersionsWithWorkspaceProtocolOnly === true,

    snapshot: {
      prereleaseTemplate: json.snapshot?.prereleaseTemplate ?? null,
      useCalculatedVersion:
        json.snapshot?.useCalculatedVersion !== undefined
          ? json.snapshot.useCalculatedVersion
          : json.___experimentalUnsafeOptions_WILL_CHANGE_IN_PATCH
              ?.useCalculatedVersionForSnapshots !== undefined
          ? json.___experimentalUnsafeOptions_WILL_CHANGE_IN_PATCH
              ?.useCalculatedVersionForSnapshots
          : false,
    },

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
    },

    // TODO consider enabling this by default in the next major version
    privatePackages:
      json.privatePackages === false
        ? { tag: false, version: false }
        : json.privatePackages
        ? {
            version: json.privatePackages.version ?? true,
            tag: json.privatePackages.tag ?? false,
          }
        : { version: true, tag: false },
  };

  if (
    config.privatePackages.version === false &&
    config.privatePackages.tag === true
  ) {
    throw new ValidationError(
      `The \`privatePackages.tag\` option is set to \`true\` but \`privatePackages.version\` is set to \`false\`. This is not allowed.`
    );
  }

  return config;
};

let fakePackage = {
  dir: "",
  packageJson: {
    name: "",
    version: "",
  },
};

export let defaultConfig = parse(defaultWrittenConfig, {
  root: fakePackage,
  tool: "root",
  packages: [fakePackage],
});
