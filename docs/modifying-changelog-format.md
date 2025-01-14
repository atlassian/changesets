# Modifying The Changelog Formats

Changesets comes with a default format for the changelogs for packages which is relatively basic in what information it displays, however this is customisable. Here we will talk about how to modify the changelog, so that it contains extra meta-information.

## Setting What Formatting Functions to Use

To change how the changelog is generated, you use the `changelog` setting in the `./changeset/config.json`. This setting accepts a string, which points to a module. You can reference an npm package that you have installed, or a local file where you have written your own functions.

For example, `changesets` has a package, `@changesets/changelog-git`. To use it, you would first need to install the package.

```
yarn add @changesets/changelog-git
```

Next, change your `.changeset/config.json` to point to the new package:

```
"changelog": "@changesets/changelog-git"
```

If you want to write your own, you can reference a file path. For example, you can create a new file `.changeset/my-changelog-config.js`, then you can reference it in the `.changeset/config.json` file as:

```
"changelog": "./my-changelog-config.js"
```

## Writing Changelog Formatting Functions

The changelog formatting is done by three different functions. `getReleaseLine`, `getDependencyReleaseLine` and (optionally) `getVersionLine`. These must be provided in an object as the export of your generation file. A basic file setup for the changelog generation functions would be:

```js
async function getReleaseLine() {}

async function getDependencyReleaseLine() {}

async function getVersionLine() {}

module.exports = {
  getReleaseLine,
  getDependencyReleaseLine,
  getVersionLine,
};
```

These functions are run during the `changeset version` and are expected to return a string (or a promise with a string).

If you are using typescript to write your changelog functions, you can use the type. First install `@changesets/types`, and then:

```ts
import { ChangelogFunctions } from "@changesets/types";

async function getReleaseLine() {}

async function getDependencyReleaseLine() {}

async function getVersionLine() {}

const defaultChangelogFunctions: ChangelogFunctions = {
  getReleaseLine,
  getDependencyReleaseLine,
  getVersionLine,
};

export default defaultChangelogFunctions;
```

```ts
// these types are pseudo-types for documentation purposes but are accurate
export type VersionType = "major" | "minor" | "patch" | "none";

// This is a release that has been modified to include all relevant information
// about releasing
export interface ComprehensiveRelease {
  name: string;
  type: VersionType;
  oldVersion: string;
  newVersion: string;
  // an array of the ids of changesets that affected this release
  changesets: string[];
  // the package.json structure of the dependency
  packageJson: PackageJSON;
  // the home directory of this package
  dir: string;
}

export interface Release {
  name: string;
  type: VersionType
}

export interface Changeset {
  // This is the string of the summary from the changeset markdown file
  summary: string;
  // This is an array of information about what is going to be released. each is an object with name: the name of the package, and type, which is "major", "minor", or "patch"
  releases: Array<{ name: string; type: VersionType }>;
  // the hash for the commit that introduced the changeset
  commit?: string;
  // the id of the changeset, which is the auto-generated filename
  id: string;
}


type getReleaseLine = (
    changeset: ChangeSet,
    // the type of the change this changeset refers to, as "major", "minor", or "patch"
    type: VersionType,
    // Any options passed to the changset generator in config.json
    changelogOpts: Record<string, any>
  ) => string;

type getDependencyReleaseLine = (
    // the changesets that pertain to this release
    changesets: Array<ChangeSet>,
    // the type of the change this changeset refers to, as "major", "minor", or "patch"
    dependentReleases: Array<ComprehensiveRelease>,
    // Any options passed to the changset generator in config.json
    changelogOpts: Record<string, any>
  ) => string

type GetVersionLine = (
    // the comprehensive release that is the primary release
    release: ComprehensiveRelease,
    // Any options passed to the changset generator in config.json
    changelogOpts: Record<string, any>
  ) => string
```

If `getVersionLine` is not provided, the default version line of `\`## ${release.newVersion}\`` will be used, like:

```md
## 4.3.0
```

## Adding Options to Changelog Functions

For some changelog generators, additional options are needed to configure the generator. The github generator for changesets is one such example:

```json
  "changelog": [
    "@changesets/changelog-github",
    { "repo": "changesets/changesets" }
  ],
```

When passing an array to `"changelog"`, the 2nd entry is the options to pass to the changelog function. In the example above, the object `{ repo: "changesets/changeets" }` is directly passed to `getReleaseLine`, `getDependencyReleaseLine`, and `getVersionLine` (if defined) as the `changelogOpts` parameter.
