# A Detailed Explanation of Changesets

Below, you will find a detailed explanation of what changesets are, and how they are being thought about.

## The problem:

When organising the release of packages, you may end up wanting to group several changes together written by different people and/or over a relatively large period of time. The best time to capture this information is when submitting a PR (when it is fresh in your mind), not when you eventually go to batch and release these changes.

Git is a bad place to store this information, as it discourages writing detailed change descriptions - you want to allow people to provide as much documentation for the change as they want.

## The solution, Changesets:

The best way to think about a changeset as separate to either a changelog or a version bump is that a changeset is an 'intent to change'. The intent to change carries with it two key bits of information:

- versioning
- changelogs

As it is an intent to change, the relevant versioning information is:

- 'major' | 'minor' | 'patch'

In addition, within a mono-repository, we can encode information about any other packages in the mono-repository that should be re-released to consume this change. This ensures that if you upgrade latest of all the packages, they are all compatible. The current implementation is heavily informed by [bolt's](https://github.com/boltpkg/bolt) opinion on version compatibility.

- changelog information can be stored as a markdown snippet.

As storing this information directly in git is problematic, we store it in the file system using the following structure:

```
-| .changeset/
-|-| UNIQUE_ID.md
```

A changeset is a Markdown file with YAML front matter. The contents of the Markdown is the change summary which will be written to the changelog and the YAML front matter describes what packages have changed and what semver bump types they should be

```md
---
"@myproject/cli": major
"@myproject/core": minor
---

Change all the things
```

This is useful because it breaks versioning into two steps:

1. Adding a changeset - can be done in a PR, by a contributor, while the change is fresh in their mind.
2. Versioning - combines all changesets, creates one version bump for each package based on the maximum version bump of each package, updates dependencies where needed, and writes changelogs. Can then be reviewed as an aggregate.

## The tooling that makes this worthwhile

1. CLI generation of new changesets.
2. Automated consumption of changesets to do versioning.
3. Detection + surfacing of changesets in PRs.

A tool to publish multiple packages from a mono-repo is also important, however does not need to be linked to this.

## Benefits to single-package repos

Changesets are designed first and foremost to handle versioning in multi-package repos, where interdependencies flowing through the system are important to understand and capture.

Conceptually though, the benefits of changesets are detachable from this. I think this process overall leads to an improvement in Pull Requests that helps increase confidence in versioning decisions and changelog entries.
