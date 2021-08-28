# Snapshot Releases

Snapshot releases are a way to release your changes for testing without updating the versions. It involves both a modified `version` and a modified `publish` command to do this. After this, you will have a published version of packages in changesets with a version of `0.0.0-{tag}-DATETIMESTAMP`.

## Starting Off

Create changesets as normal, and then when, you are ready to release a snapshot, you should make a branch from which to do so.

## Versioning your packages

```
yarn changeset version --snapshot
```

This will apply the changesets, but instead of using the next version, all versions will be set to `0.0.0-THE_TIME_YOU_DID_THIS`.

If you want to add a personalised part to this version number, such as `bulbasaur`, you can run

```
yarn changeset version --snapshot bulbasaur
```

This will instead update versions to `0.0.0-bulbasaur-THE_TIME_YOU_DID_THIS`

## Publishing your packages

After running version, you can use the `changeset publish --tag bulbasaur` command to release the packages. By using the `--tag` flag, you will not add it to the `latest` flag on npm. This is REALLY IMPORTANT because if you do not include a tag, people installing your package using `yarn add your-package-name` will install the snapshot version.

## Using a snapshot version

When you want to get people to test your snapshots, they can either update their package.json to your newly published version and run an install, or use `yarn add your-package-name@YOUR_TAG_OR_VERSIONS`

For our above example, you could run

```
yarn add your-package-name@0.0.0-bulbasaur-THE_TIME_YOU_DID_THIS
```

or the tag:

```
yarn add your-package-name@bulbasaur
```

## What to do with the snapshot branch

In almost all circumstances, we recommend that the changes after you have run `version` get merged back into your main branch. With snapshots, this is not the case. We recommend that you do not push the changes from this running of `version` to any branch. This is because the snapshot is intended for installation only, not to represent the correct published state of the repo. Save the generated version, and the tag you used, but do not push this to a branch you are planning to merge into the main branch, or merge it into the main branch.
