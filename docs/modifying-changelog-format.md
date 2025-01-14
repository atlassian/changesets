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

The changelog formatting is done by two different functions. `getReleaseLine` and `getDependencyReleaseLine`. These must be provided in an object as the export of your generation file. A basic file setup for the changelog generation functions would be:

```js
async function getReleaseLine() {}

async function getDependencyReleaseLine() {}

module.exports = {
  getReleaseLine,
  getDependencyReleaseLine,
};
```

These functions are run during the `changeset version` and are expected to return a string (or a promise with a string).

If you are using typescript to write your changelog functions, you can use the type. First install `@changesets/types`, and then:

```ts
import { ChangelogFunctions } from "@changesets/types";

async function getReleaseLine() {}

async function getDependencyReleaseLine() {}

const defaultChangelogFunctions: ChangelogFunctions = {
  getReleaseLine,
  getDependencyReleaseLine,
};

export default defaultChangelogFunctions;
```

```ts
type getReleaseLine(
    changeset: {
        // This is the string of the summary from the changeset markdown file
        summary: string
        // This is an array of information about what is going to be released. each is an object with name: the name of the package, and type, which is "major", "minor", or "patch"
        releases
        // the hash for the commit that introduced the changeset
        commit
    },
    // the type of the change this changeset refers to, as "major", "minor", or "patch"
    type
    // An options object that contains the repository name e.g.: { repo: 'my-repo'}
    changelogOpts
) => string
```

If you need to read the repo from the `changelogOpts`, make sure you add this information in the `config.json` file, for example:

```json
"changelog": [
    "./changelog-config.js",
    { "repo": "corradin/poc-packages-monorepo" }
  ],
```

When using TypeScript, make sure you transpile it to JavaScript, because changesets is not able to parse typescript files that are referred to from the config file. You can do so, by:

1. Adding a `tsconfig.json` file in the `.changeset` directory.
2. Run `tsc` before running `changeset version`

As an example, I wrote the following script in the root `package.json`:

```json
"version": "tsc --project .changeset && changeset version",
```

In this way, it is more convenient to run this command as part of your CICD with the changeset action.

TODO - this guide is incomplete. Until it is completed, you may need to dig into the code for some of our existing

## Adding Options to Changelog Functions

TODO
