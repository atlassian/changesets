---
"@changesets/assemble-release-plan": minor
"@changesets/config": minor
"@changesets/types": minor
---

Add a serials of config options to control the behaviour of auto bumping of peers dependents.

- `autoBumpPeerDependentsInSameChangeset`: boolean, default to `true` for compatibility reason,
  if set to `false`, auto bumping of peer dependents will be disabled.

- `autoBumpPeerDependentsCondition`: string enum of `"always"` or `"out-of-range"`, default to `"always"`
  for compatibility reason, auto bumping of peer dependents will only be triggered when the bumped version
  is out of semver range specified by the peer dependent.

- `autoBumpPeerDependentsStrategy`: string enum of `"major"` or `"follow"`, default to `"major"` for
  compatibility reason, if set to `"follow"`, the bump type of peer dependents will follow the bump type
  of the bumped package.
