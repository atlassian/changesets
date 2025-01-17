# Changesets Dictionary

This is a list of some words and phrases that are used in changesets which are helpful to know so that contributors to changesets have a shared understanding of various concepts in the project.

Several of these have associated type definitions, which you can find in [our types package](../packages/types).

- **changeset** - an intent to release a set of packages at particular bump types with a summary of the changes made. Changesets are stackable, that is running `bump` will apply any number of changesets correctly. Changesets are used to generate further information, such as the `release information`, and the `release plan`.
- **summary** - Information about the changes the changeset represents - this is written out to the `CHANGELOG.md` file of every package mentioned in the changeset.
- **changeset folder** - A `./changeset` folder - this is where we store written versions of changesets. Currently we assume all changesets are written to this.
- **workspace** - a local package in a multi-package repo
- **bump-type** - The type of change expected. Of type `major | minor | patch | none`, based on the change types of [semver](https://semver.org/)
- **range-type** - The type of range a package depends on, such as `1.0.0`, `~1.0.0`, or `^1.0.0`. This is a subset of valid semver ranges as [defined by node](https://github.com/npm/node-semver#ranges), narrowing to ranges we can update programmatically.
- **bump**
  - (1) The command to apply all current changesets and update all package versions and changelogs.
  - (2) The act of updating a package version to a new version.
- **single-package repo** - A repository which only contains a single package which is at the root of the repo
- **multi-package repo/monorepo** - A repository which contains multiple packages, generally managed by [Bolt](https://github.com/boltpkg/bolt) or [Yarn Workspaces](https://yarnpkg.com/lang/en/docs/workspaces/).
- **release line generators** - The `getReleaseLine` and `getDependencyReleaseLine` functions which are responsible for creating the lines inserted into changelog. A changelog entry for a particular release can be thought of as `releaseLineGenerators(changesets)`
- **fixed packages** - Fixed packages share a semver categorisation, such that all fixed packages have the same semver version and are always published together. The logistics of this are best left to our [fixed-packages](./fixed-packages.md) documentation.
- **linked packages** - Linked packages share a semver categorisation, such that all published linked packages have consistent new semver ranges. The logistics of this are best left to our [linked-packages](./linked-packages.md) documentation.
- **release instruction** An object containing an intent to release a single package, consisting of the package name and a bump type
- **release plan** - A calculated object that shows everything a collection of changesets will release, and at what version, and how. This object includes a calculation of dependencies, and considerations for `linked` packages.
- **absolutely correct semver** - making semver versioning decisions to ensure nothing less than major is capable of breaking a consumer's code. Because literally any change is technically capable of breaking a user's code, absolutely correct semver requires that all changes are major changes.
- **pragmatically correct semver** - Making semver decisions that you believe to be correct, but may be in error. A pragmatic assessment is likely to change with the number of users of a project, and the API surface area of the project. Whenever we talk about 'correct semver', we are referring to 'pragmatically correct semver'
- **dependency** - A package that is depended upon by another given package.
- **dependent** - A package which depends on another given package. This is frequently used in the context of getting the dependents of a package so they can be released.
- **release** - The combination of versioning and publishing a package or packages which may include a build process before publishing
- **prereleases** - A pre-release is a release that uses a tag, and is not published as `latest` on npm. This is designed for when you want to share code, but are not yet ready for it to be the main package used by everyone. Pre-releases for packages are common, but pre-releases within a monorepo presents unique problems. You can see our exhaustive pre-release documentation [in our prereleases documentation](./prereleases.md). In addition, there are two different approaches to pre-releases which are defined for use separately.
- **Release Candidate (RC) prerelease** - An RC prerelease is done before an intended important release, likely a major release. It includes semver information about what the next intended release version is, a tag, and an iterated number for the prerelease. The output of this is intended to be committed, and then further work done on the branch. An example would be if I am on `1.0.0` of a package, and I want to do an RC for the next `major` version we would have: `package-one@2.0.0-my-tag.0`, and then the next publish is `package-one@2.0.0-my-tag.1`.
- **snapshot prerelease** - A snapshot pre-release is intended to make it easy to test all changes at a particular git commit. It is published at `0.0.0` and uses the git hash as the tag. This should be used as a less formal method than a release candidate to make it easy to install and test changes. An example, if we have a package at `1.0.0`, and have a changeset for it to be `major` bumped, a snapshot release will be at `0.0.0-ABCDEFGH` (the last github hash). If we add more commits, the next snapshot would be `0.0.0-HIJKLMNOP`.

## Things that we haven't figured out how to explain well yet

- The fact that a package is depending on a package and what the range of the dependency is specified in the list of the package's dependencies. This is specifically not about the dependency but about the relationship between the dependent and the dependency.
