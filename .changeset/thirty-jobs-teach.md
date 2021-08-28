---
"@changesets/git": patch
"@changesets/cli": patch
---

Avoid an infinite loop when git commands fail to execute when Changesets try to retrieve commits that added files.
