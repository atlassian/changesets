---
"@changesets/read": minor
"@changesets/cli": minor
---

From now on, changeset files starting with a dot (e.g. `.ignored-temporarily.md`) will be be ignored and kept around after versioning. This allows you to prepare a changeset for something that isn't supposed to be released immediately. An example use case could involve code hidden behind a feature flag.
