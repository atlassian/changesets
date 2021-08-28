# Prereleases

> Warning! Prereleases are very complicated! Using them requires a thorough understanding of all parts of npm publishes. Mistakes can lead to repository and publish states that are very hard to fix.

> Warning: If you decide to do prereleases from the main branch of your repository, without having a branch for your last stable release without the prerelease changes, you will block other changes until you are ready to exit prerelease mode. We thoroughly recommend only running prereleases from a branch other than the main branch.

You might want to release a version of your packages before you do an actual release, Changesets lets you do this but there are some caveats because of the complexity that monorepos add that are important to understand.

When you want to do a prerelease, you need to enter prerelease mode. You can do that with the `pre enter <tag>`. The tag that you need to pass is used in versions(e.g. `1.0.0-beta.0`) and for the npm dist tag.

A prerelease workflow might look something like this:

```bash
yarn changeset pre enter next
yarn changeset version
git add .
git commit -m "Enter prerelease mode and version packages"
yarn changeset publish
git push --follow-tags
```

Let's go through what's happening here. For this example, let's say you have a repo that looks like this:

```
packages/
  pkg-a@1.0.0 has dep on pkg-b@^2.0.0
  pkg-b@2.0.0 has no deps
  pkg-c@3.0.0 has no deps
.changeset/
  pkg-b@minor
```

```
yarn changeset pre enter next
```

This command changes Changesets into prerelease mode which creates a `pre.json` file in the `.changeset` directory which stores information about the state the prerelease is in. For the specific data stored in the `pre.json` file, see the type definition of `PreState` in [`@changesets/types`](../packages/types).

```
yarn changeset version
```

This command will version packages as you would normally expect but append `-next.0`. An important note is that this will bump dependent packages that wouldn't be bumped in normal releases because prerelease versions are not satisfied by most semver ranges.(e.g. `^5.0.0` is not satisfied by `5.1.0-next.0`)

The repo would now look like this:

```
packages/
  pkg-a@1.0.1-next.0 has dep on pkg-b@^2.0.1
  pkg-b@2.1.0-next.0 has no deps
  pkg-c@3.0.0 has no deps
.changeset/
```

```
yarn changeset publish
```

This command will publish to npm as the publish command normally does though it will set the dist tag to the tag you specified when running the prerelease command.

When you want to do another prerelease, your workflow would look something like this:

```bash
yarn changeset version
git add .
git commit -m "Version packages"
yarn changeset publish
git push --follow-tags
```

Let's say we add some changesets and a new package so our repo looks like this

```
packages/
  pkg-a@1.0.1-next.0 has dep on pkg-b@^2.0.1
  pkg-b@2.1.0-next.0 has no deps
  pkg-c@3.0.0 has no deps
  pkg-d@0.0.0 has no deps

.changeset/
  pkg-a@minor
  pkg-c@patch
  pkg-d@major
```

```
yarn changeset version
```

The version command will behave just like it does for the first versioning of a prerelease except the number at the end will be updated. The repo would now look like this:

```
packages/
  pkg-a@1.1.0-next.1 has dep on pkg-b@^2.0.1
  pkg-b@2.1.0-next.0 has no deps
  pkg-c@3.0.1-next.0 has no deps
  pkg-d@1.0.0-next.0 has no deps
```

```
yarn changeset publish
```

This command will publish to npm just like it does for the first prerelease except because we're adding a new package(we need to define this, is it new to the repo or new to npm? I'm thinking new to npm), the new package will be published with the `latest` dist tag rather than the `next` tag because it's the first time it's being published which means it will be on `latest` anyway. For future publishes until pkg-d is out of prerelease, it will also be published to `latest`.

When you're ready to do the final release, your workflow would look something like this:

```bash
yarn changeset pre exit
yarn changeset version
git add .
git commit -m "Exit prerelease mode and version packages"
yarn changeset publish
git push --follow-tags
```

```
yarn changeset pre exit
```

This command will set an intent to exit prerelease mode in the `pre.json` file though it won't do any actual versioning.

```
yarn changeset version
```

The version command will apply any changesets currently in the repo and then remove the prerelease tag from the versions. The repo would now look like this:

```
packages/
  pkg-a@1.1.0 has dep on pkg-b@^2.0.1
  pkg-b@2.1.0 has no deps
  pkg-c@3.0.1 has no deps
  pkg-d@1.0.0 has no deps
```

```
yarn changeset publish
```

The publish command will publish everything to the `latest` dist tag as normal.
