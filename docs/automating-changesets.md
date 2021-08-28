# Automating Changesets

While changesets is designed to work with a fully manual process, it also provides tools to help automate these releases. These can be broken into two major decisions:

1. How do I want to ensure pull requests have changesets?
2. How do I run the version and publish commands?

Here we have a quick-start recommended workflow, with more

## Recommended Automation Flow

1. Install our [changeset bot](https://github.com/apps/changeset-bot) into your repository.
2. Add the [github action](https://github.com/changesets/action) to your repository.

## How do I want to ensure pull requests have changesets?

Changesets are committed to files, and so a diligent reviewer can always technically tell if a changeset is absent and request one be added. As humans though, a file not being there is easy to miss. We recommend adding some way to detect the presence or absence of changesets on a pull request so you don't have to, as well as highlight it to pull-request makers so you don't have to.

This has two main approaches.

### Non-blocking

In this approach, a pull request may be merged if no changeset is present, and a missing changeset does not create a red build. Our [github changeset bot](https://github.com/apps/changeset-bot) is the best way to prompt for changesets without making them blocking. As a handy extra feature, they give you a link to add your own changeset as a maintainer to smooth over merging pull requests without waiting for the contributor to add a changeset.

### Blocking

In some cases, you may want to make CI fail if not changeset is present, to ensure no PR can be merged without a changeset. To do this:

In your CI process add a step that runs:

```bash
changeset status --sinceMaster
```

This will exit with the exit code 1 if there have been no new changesets since master.

In some cases, you may _want_ to merge a change without doing any releases (such as when you only change tests or build tools). In this case, you can run `changeset --empty`. This will add a special changeset that does not release anything.

## How do I run the version and publish commands?

We have a [github action](https://github.com/changesets/action) that

- creates a `version` PR, then keeps it up to date, recreating it when merged. This PR always has an up-to-date run of `changeset version`
- Optionally allows you to do releases when changes are merged to the base branch.

If you don't want to use this action, the manual workflow we recommend for running the `version` and `publish` commands is:

- A release coordinator (RC) calls to stop any merging to the base branch
- The RC pulls down the base branch, runs `changeset version`, then makes a new PR with the versioning changes
- The versioning changes are merged back into the base branch
- The RC pulls the base branch again and runs `changeset publish`
- The RC runs `git push --follow-tags` to push the release tags back
- The RC unblocks merging to the base branch

This is a lot of steps, and is quite finnicky (we have to pull from the base branch twice). Feel free to finesse it to your own circumstances.
