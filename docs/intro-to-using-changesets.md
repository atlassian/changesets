# Using Changesets

Changesets are designed to make your workflows easier, by allowing the person making contributions to make key decisions when they are making their contribution. Changesets hold two key bits of information: a version type (following [semver](https://semver.org/)), and change information to be added to a changelog.

In addition, changesets were originally designed for implementation in [bolt monorepos](https://github.com/boltpkg/bolt). As such, in a monorepo context, changesets will handle bumping dependencies of changed packages, if that is required.

This guide is aimed at package maintainers adding changesets as a tool. For the information relevant to contributors, see [adding a changeset](./adding-a-changeset.md).

The overall tool after initialization should lead to a loop that looks like:

1. Changesets added along with each change
2. The version command is run when a release is ready, and the changes are verified
3. The publish command is run afterwards.

The second two steps can be made part of a CI process.

## Add the changeset tool

```shell
yarn add @changesets/cli && yarn changeset init
```

or

```shell
npx @changesets/cli init
```

## Adding changesets

```shell
yarn changeset
```

or

```shell
npx @changesets/cli
```

> Note: You can run `changeset add` to add a changeset if you want to, but running Changesets without any command works as well.

## Versioning and publishing

Once you decide you want to do a release, you can run

```shell
yarn changeset version
```

or

```shell
npx @changesets/cli version
```

This consumes all changesets, and updates to the most appropriate semver version based on those changesets. It also writes changelog entries for each consumed changeset.

We recommend at this step reviewing both the changelog entries and the version changes for packages. Once you are confident that these are correct, and have made any necessary tweaks to changelogs, you can publish your packages:

```shell
yarn changeset publish
```

or

```shell
npx @changesets/cli publish
```

This will run npm publish in each package that is of a later version than the one currently listed on npm.

## Some handy advice

### Not every change requires a changeset

Since changesets are focused on releases and changelogs, changes to your repository that don't require these won't need a changeset. As such, we recommend not adding a blocking element to contributions in the absence of a changeset.
