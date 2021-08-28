# Configuring Changesets

Changesets has a minimal amount of configuration options. Mostly these are for when you need to change the default workflows. These are stored in `.changeset/config.json`. Our default config is:

```json
{
  "commit": false,
  "updateInternalDependencies": "patch",
  "linked": [],
  "access": "restricted",
  "baseBranch": "master",
  "ignore": [],
  "changelog": "@changesets/cli/changelog"
}
```

> NOTE: the `linked`, `updateInternalDependencies`, and `ignore` options are only for behaviour in monorepos.

## `commit` (`true` | `false`)

This argument sets whether the `changeset add` command and the `changeset publish` command will also add and commit the changed files using git. By default, we do not commit the files, and leave it to the user to commit the files.

## `access` (`restricted` | `public`)

This sets how packages are published - if `access: "restricted"`, packages will be published as private, requiring log in to an npm account with access to install. If `access: "public", the packages will be made available on the public registry.

By default, npm publishes scoped npm packages as `restricted` - so to ensure you do not accidentally publish code publicly, we default to `restricted`. For most cases you will want to set this to `public`.

This can be overridden in specific packages by setting the `access` in a package's `package.json`.

If you want a package from being published to npm at all, set `private: true` in that package's `package.json`

## `baseBranch` (git branch name)

The branch to which changesets will make comparisons. A number of internal changesets features use git to compare present changesets against another branch. This defaults what branch will be used for these comparisons. This should generally set to the major branch you merge changes into. Commands that use this information accept a `--since` option which can be used to override this.

> We recommend changing the name of your `master` branch to help make coding a more inclusive experience

## `ignore` (array of packages)

This option allows you to specify some packages that will not be published, even if they are referenced in changesets. Instead, those changesets will be skipped until they are removed from this array.

> THIS FEATURE IS DESIGNED FOR TEMPORARY USE TO ALLOW CHANGES TO BE MERGED WITHOUT PUBLISHING THEM - If you want to stop a package from being published at all, set `private: true` in its `package.json`.

There are two caveats to this.

1. If the package is mentioned in a changeset that also includes a package that is not ignored, publishing will fail.
2. If the package requires one of its dependencies to be updated as part of a publish.

These restrictions exist to ensure your repository or published code do not end up in a broken state. For a more detailed intricacies of publishing, check out our guide on [problems publishing in monorepos](./problems-publishing-in-monorepos.md).

> NOTE: you can also provide glob expressions to match the packages, according to the [micromatch](https://www.npmjs.com/package/micromatch) format.

## `linked` (array of package names)

This option can be used to declare that packages should 'share' a version, instead of being versioned completely independently. As an example, if you have a `@changesets/button` component and a `@changesets/theme` component and you want to make sure that when one gets bumped to `2.0.0`, the other is also bumped to `2.0.0`. To achieve this you would have the config:

```json
{
  "linked": ["@changesets/button", "@changesets/theme"]
}
```

If you want to use this option, you should read the documentation on [linked packages](./linked-packages.md) to fully understand the implementation and implications.

> NOTE: This does not do what some other tools do, which is make sure when any package is published, all other packages are also published with the same version.

## `updateInternalDependencies`

This option sets whether, when a package that is being dependend upon changes, whether you should update what version it depends on. To make this more understandable, here is an example:

Say we have two packages, one depending on the other:

```
pkg-a @ version 1.0.0
pkg-b @ version 1.0.0
  depends on pkg-a at range `^1.0.0
```

Say we are publishing a patch of both `pkg-a` and `pkg-b` - this flag is for determining whether we update how `pkg-b` depends on `pkg-a`.

If the option is set to `patch`, we will update the dependency so we will now have:

```
pkg-a @ version 1.0.1
pkg-b @ version 1.0.1
  depends on pkg-a at range `^1.0.1
```

If however the option is set to `minor`, what it depends on will only be updated when there is a minor change, so the state would be:

```
pkg-a @ version 1.0.1
pkg-b @ version 1.0.1
  depends on pkg-a at range `^1.0.0
```

Using `minor` allows consumers to more actively control their own deduplication of packages, and will allow them to install fewer versions if you have many interconnected packages. Using `patch` will mean consumers will more often be using more updated code, but may cause problems with deduplication.

Changesets will always update the dependency if it would leave the old semver range.

> ⚠ Note: this is only applied for packages which are already released in the current release. If A depends on B and we only release B then A won't be bumped.

## `changelog` (false or a path)

This option is for setting how the changelog for packages should be generated. If it is `false`, no changelogs will be generated. Setting it to a string specifies a path from where we will load the changelog generation functions. It expects to be a file that exports the following:

```
{
  getReleaseLine,
  getDependencyReleaseLine
}
```

As well as the default one, you can use `@changesets/changelog-git`, which adds links to commits into changelogs, or `@changesets/changelog-github`, which requires github authentication, and includes a thankyou message to the person who added the changeset as well as a link to the relevant PR.

You would specify our github changelog generator with: `"changelog": "@changesets/changelog-github"`

For more details on these functions and information on how to write your own see [changelog-functions](./modifying-changelog-format.md)

## `bumpVersionsWithWorkspaceProtocolOnly`

When it is enabled then only dependencies using workspace protocol (e.g. `"foo": "workspace:^1.0.0" are considered to be part of the monorepo and only those are being updated when versioning.
