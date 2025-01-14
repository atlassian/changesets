---
"@changesets/get-packages": minor
"@changesets/types": minor
---

This adds a new `@changesets/get-packages` package that enables additional workspaces to be defined in the changesets config file. This package wraps the existing `@manypkg/get-packages` tool which means that it is backwards compatible.

#### Why the change?

This change enables users to define additional workspaces in the changesets config file. This is useful for monorepos that have multiple workspaces that are not (and cannot be) defined in the root `package.json` file. As an example, it is common for examples to have their own full installation of dependencies, but not be included in the root `package.json` file.

#### How to use it

Add a `additionalWorkspaces` key to your changesets config file. This key should be an array of strings that are the glob patterns for the additional workspaces you want to include in the changesets config.

```json
{
  "___experimentalUnsafeOptions_WILL_CHANGE_IN_PATCH": {
    "additionalWorkspaces": ["nested-package", "more-packages/*"]
  }
}
```

This is a minor change bump because the package is pre-1.0.0 as the API for the `additionalWorkspaces` feature is marked as experimental.
