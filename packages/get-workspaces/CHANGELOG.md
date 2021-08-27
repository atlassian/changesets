# get-workspaces

## 1.0.4

### Patch Changes

- Updated dependencies [[`e89e28a`](https://github.com/atlassian/changesets/commit/e89e28a05f5fa43307db73812a6bcd269b62ddee)]:
  - @changesets/types@4.0.1

## 1.0.3

### Patch Changes

- Updated dependencies [[`de2b4a5`](https://github.com/atlassian/changesets/commit/de2b4a5a7b244a37d94625bcb70ecde9dde5b612)]:
  - @changesets/types@4.0.0

## 1.0.2

### Patch Changes

- Updated dependencies [[`2b49d66`](https://github.com/atlassian/changesets/commit/2b49d668ecaa1333bc5c7c5be4648dda1b11528d)]:
  - @changesets/types@3.0.0

## 1.0.1

### Patch Changes

- Updated dependencies [[`011d57f`](https://github.com/atlassian/changesets/commit/011d57f1edf9e37f75a8bef4f918e72166af096e)]:
  - @changesets/types@2.0.0

## 1.0.0

### Major Changes

- [`cc8c921`](https://github.com/atlassian/changesets/commit/cc8c92143d4c4b7cca8b9917dfc830a40b5cda20) [#290](https://github.com/atlassian/changesets/pull/290) Thanks [@mitchellhamilton](https://github.com/mitchellhamilton)! - `get-workspaces` has been replaced by `@manypkg/get-packages`, please use that package instead. See `@manypkg/get-packages` README for the API changes.

### Patch Changes

- Updated dependencies [[`41e2e3d`](https://github.com/atlassian/changesets/commit/41e2e3dd1053ff2f35a1a07e60793c9099f26997), [`cc8c921`](https://github.com/atlassian/changesets/commit/cc8c92143d4c4b7cca8b9917dfc830a40b5cda20), [`cc8c921`](https://github.com/atlassian/changesets/commit/cc8c92143d4c4b7cca8b9917dfc830a40b5cda20), [`2363366`](https://github.com/atlassian/changesets/commit/2363366756d1b15bddf6d803911baccfca03cbdf)]:
  - @changesets/types@1.0.0

## 0.6.0

### Minor Changes

- [`fe0d9192`](https://github.com/atlassian/changesets/commit/fe0d9192544646e1a755202b87dfe850c1c200a3) [#236](https://github.com/atlassian/changesets/pull/236) Thanks [@Andarist](https://github.com/Andarist)! - Added support for finding pnpm workspace packages. It has been added to default queried tools.

* [`fe0d9192`](https://github.com/atlassian/changesets/commit/fe0d9192544646e1a755202b87dfe850c1c200a3) [#236](https://github.com/atlassian/changesets/pull/236) Thanks [@Andarist](https://github.com/Andarist)! - Read also pnpm workspace packages when searching for packages.

## 0.5.2

### Patch Changes

- Updated dependencies [[`8f0a1ef`](https://github.com/atlassian/changesets/commit/8f0a1ef327563512f471677ef0ca99d30da009c0)]:
  - @changesets/types@0.4.0

## 0.5.1

### Patch Changes

- [`a679b1d`](https://github.com/atlassian/changesets/commit/a679b1dcdcb56652d31536e2d6326ba02a9dfe62) [#204](https://github.com/atlassian/changesets/pull/204) Thanks [@Andarist](https://github.com/Andarist)! - Correctly handle the 'access' flag for packages

  Previously, we had access as "public" or "private", access "private" isn't valid. This was a confusing because there are three states for publishing a package:

  - `private: true` - the package will not be published to npm (worked)
  - `access: public` - the package will be publicly published to npm (even if it uses a scope) (worked)
  - `access: restricted` - the package will be published to npm, but only visible/accessible by those who are part of the scope. This technically worked, but we were passing the wrong bit of information in.

  Now, we pass the correct access options `public` or `restricted`.

- Updated dependencies [[`a679b1d`](https://github.com/atlassian/changesets/commit/a679b1dcdcb56652d31536e2d6326ba02a9dfe62)]:
  - @changesets/types@0.3.1

## 0.5.0

### Minor Changes

- [296a6731](https://github.com/atlassian/changesets/commit/296a6731) - Safety bump: Towards the end of preparing changesets v2, there was a lot of chaos - this bump is to ensure every package on npm matches what is found in the repository.

## 0.4.2

### Patch Changes

- [a15abbf9](https://github.com/changesets/changesets/commit/a15abbf9) - Previous release shipped unbuilt code - fixing that

## 0.4.0

### Minor Changes

- [cbb2c953](https://github.com/changesets/changesets/commit/cbb2c953) [#89](https://github.com/changesets/changesets/pull/89) Thanks [@highvoltag3](https://github.com/highvoltag3)! - Making sure the arrays are sorted before using them

### Patch Changes

- [d4bbab4e](https://github.com/changesets/changesets/commit/d4bbab4e) [#91](https://github.com/changesets/changesets/pull/91) Thanks [@mitchellhamilton](https://github.com/mitchellhamilton)! - Add PackageJSON type
- [94267ff3](https://github.com/changesets/changesets/commit/94267ff3) [#106](https://github.com/changesets/changesets/pull/106) Thanks [@mitchellhamilton](https://github.com/mitchellhamilton)! - Add private property to PackageJSON type

## 0.3.1

### Patch Changes

- [20da7747](https://github.com/changesets/changesets/commit/20da7747) [#66](https://github.com/changesets/changesets/pull/66) Thanks [@Noviny](https://github.com/Noviny)! - Update package.json field so each links into its own package

## 0.3.0

### Minor Changes

- [83ba6d3f](https://github.com/Noviny/changesets/commit/83ba6d3f) - Export Workspace type

### Patch Changes

- [a966701d](https://github.com/Noviny/changesets/commit/a966701d) - Add repository information to package.json

## 0.2.1

### Patch Changes

- [67db935d](https://github.com/Noviny/changesets/commit/67db935d) - Fix release without built files

## 0.2.0

### Minor Changes

- [355b4d00](https://github.com/Noviny/changesets/commit/355b4d00) [#41](https://github.com/Noviny/changesets/pull/41) Thanks [@mitchellhamilton](https://github.com/mitchellhamilton)! - Throw when the name field is missing in a package.json

### Patch Changes

- [c6f1c7b7](https://github.com/Noviny/changesets/commit/c6f1c7b7) [#46](https://github.com/Noviny/changesets/pull/46) Thanks [@mitchellhamilton](https://github.com/mitchellhamilton)! - Distribute TypeScript types
- [355b4d00](https://github.com/Noviny/changesets/commit/355b4d00) [#41](https://github.com/Noviny/changesets/pull/41) Thanks [@mitchellhamilton](https://github.com/mitchellhamilton)! - Convert package to TypeScript

## 0.1.1

### Patch Changes

- [bed96aa2](https://github.com/Noviny/changesets/commit/bed96aa2) [#35](https://github.com/Noviny/changesets/pull/35) Thanks [@mitchellhamilton](https://github.com/mitchellhamilton)! - Use workspaces.packages instead of the incorrect workspaces.package field for resolving yarn workspaces

## 0.1.0

### Minor Changes

- [b93d04a2](https://github.com/Noviny/changesets/commit/b93d04a2) - Initial release of get-workspaces
