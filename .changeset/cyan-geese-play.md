---
"@changesets/apply-release-plan": minor
---

Add optional `getVersionLine` changelog function

- By making the version line configurable, it becomes possible for users to override the default display to add a date, or a github tag range like standard-version does
- This allows users who are doing continuous deploy to implement version-then-publish, without creating risk for other changeset users
