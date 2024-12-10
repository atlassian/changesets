---
"@changesets/config": patch
---

Make `packages` an optional parameter in the `read` function. When `packages` are not passed in explicitly from the caller they now will be read based on the passed in `cwd`.
