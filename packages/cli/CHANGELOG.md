# @changesets/cli

## 2.27.11

### Patch Changes

- Updated dependencies [[`f0270f6`](https://github.com/changesets/changesets/commit/f0270f69793ddb6865f2510d334864b093cb10e3)]:
  - @changesets/config@3.0.5
  - @changesets/apply-release-plan@7.0.7
  - @changesets/get-release-plan@4.0.6

## 2.27.10

### Patch Changes

- [#1485](https://github.com/changesets/changesets/pull/1485) [`baf5644`](https://github.com/changesets/changesets/commit/baf56448606e005577dbe2fb1e78ff457dcaaefd) Thanks [@bluwy](https://github.com/bluwy)! - Ignore error if failed to find changed packages in `changeset add`

- [#1489](https://github.com/changesets/changesets/pull/1489) [`7bf751c`](https://github.com/changesets/changesets/commit/7bf751cd80d49527026709529025beb0f6f0732a) Thanks [@marcalexiei](https://github.com/marcalexiei)! - Use custom errors when exiting add command due to missing tool

- [#1466](https://github.com/changesets/changesets/pull/1466) [`ccce743`](https://github.com/changesets/changesets/commit/ccce7433d5183fbccb3e3ad9005c66c3b3bc6bd9) Thanks [@marcalexiei](https://github.com/marcalexiei)! - Add error message and exit when there are no versionable packages

- [#1514](https://github.com/changesets/changesets/pull/1514) [`962ab91`](https://github.com/changesets/changesets/commit/962ab918bc2deb89012a0cefce10387997cc54ed) Thanks [@nicoalonsop](https://github.com/nicoalonsop)! - Update spawndamnit to fix [cross-spawn vulnerability](https://security.snyk.io/vuln/SNYK-JS-CROSSSPAWN-8303230)

- Updated dependencies [[`7323704`](https://github.com/changesets/changesets/commit/7323704dff6e76f488370db384579b86c95c866f), [`26c8ba9`](https://github.com/changesets/changesets/commit/26c8ba9f58d3b123a19106771b4bdcb2800235cc), [`82cacb2`](https://github.com/changesets/changesets/commit/82cacb2227cf3a215cd9d29b9fb0c860f20ba2ca), [`962ab91`](https://github.com/changesets/changesets/commit/962ab918bc2deb89012a0cefce10387997cc54ed)]:
  - @changesets/config@3.0.4
  - @changesets/git@3.0.2
  - @changesets/assemble-release-plan@6.0.5
  - @changesets/read@0.6.2
  - @changesets/apply-release-plan@7.0.6
  - @changesets/get-release-plan@4.0.5

## 2.27.9

### Patch Changes

- [#1458](https://github.com/changesets/changesets/pull/1458) [`400ab7b`](https://github.com/changesets/changesets/commit/400ab7b5995aa4463c8db003a97bcfe11185422e) Thanks [@benmccann](https://github.com/benmccann)! - Moved `@types/semver` to `devDependencies`

- [#1462](https://github.com/changesets/changesets/pull/1462) [`689e541`](https://github.com/changesets/changesets/commit/689e54127fe059425c6be51e2802879b49b0b5d8) Thanks [@benmccann](https://github.com/benmccann)! - remove `outdent` dependency

## 2.27.8

### Patch Changes

- [#1417](https://github.com/changesets/changesets/pull/1417) [`bc75c1a`](https://github.com/changesets/changesets/commit/bc75c1a74c2d46e08620c7aa0e9f4f5ef40a9b55) Thanks [@trivikr](https://github.com/trivikr)! - Replace `chalk` with `picocolors` to reduce install size

- [#1419](https://github.com/changesets/changesets/pull/1419) [`4efc038`](https://github.com/changesets/changesets/commit/4efc0382fcf7ef0ebd0d8e0515b655b6870728f1) Thanks [@bluwy](https://github.com/bluwy)! - Fix logging `--version` flag

- [#1445](https://github.com/changesets/changesets/pull/1445) [`52c302a`](https://github.com/changesets/changesets/commit/52c302a48a662f71585f18f91dad3cbe49d75890) Thanks [@bluwy](https://github.com/bluwy)! - Remove unused `@babel/runtime` dependency

- [#1446](https://github.com/changesets/changesets/pull/1446) [`5150fc1`](https://github.com/changesets/changesets/commit/5150fc174ea55406da401cacdd68a9a2e754126d) Thanks [@benmccann](https://github.com/benmccann)! - Switched from `preferred-pm` to `package-manager-detector` in order to reduce installation size

- Updated dependencies [[`bc75c1a`](https://github.com/changesets/changesets/commit/bc75c1a74c2d46e08620c7aa0e9f4f5ef40a9b55), [`52c302a`](https://github.com/changesets/changesets/commit/52c302a48a662f71585f18f91dad3cbe49d75890)]:
  - @changesets/get-dependents-graph@2.1.2
  - @changesets/logger@0.1.1
  - @changesets/read@0.6.1
  - @changesets/assemble-release-plan@6.0.4
  - @changesets/should-skip-package@0.1.1
  - @changesets/apply-release-plan@7.0.5
  - @changesets/get-release-plan@4.0.4
  - @changesets/write@0.3.2
  - @changesets/git@3.0.1
  - @changesets/pre@2.0.1
  - @changesets/config@3.0.3

## 2.27.7

### Patch Changes

- [#1047](https://github.com/changesets/changesets/pull/1047) [`d108fa6`](https://github.com/changesets/changesets/commit/d108fa66e63c3000f42db7580a862b737e241c4d) Thanks [@patzick](https://github.com/patzick)! - Fixed a crash that could occur when depending on a tagged version of another workspace package.

- [#1400](https://github.com/changesets/changesets/pull/1400) [`dd6e5bb`](https://github.com/changesets/changesets/commit/dd6e5bbf74e246d7a742aa50424989462679b0ca) Thanks [@Andarist](https://github.com/Andarist)! - Fixed a crash that prevented the CLI from running in a scenario when a workspace depends on the root workspace

- Updated dependencies [[`d108fa6`](https://github.com/changesets/changesets/commit/d108fa66e63c3000f42db7580a862b737e241c4d), [`dd6e5bb`](https://github.com/changesets/changesets/commit/dd6e5bbf74e246d7a742aa50424989462679b0ca), [`dd6e5bb`](https://github.com/changesets/changesets/commit/dd6e5bbf74e246d7a742aa50424989462679b0ca)]:
  - @changesets/apply-release-plan@7.0.4
  - @changesets/config@3.0.2
  - @changesets/get-dependents-graph@2.1.1
  - @changesets/assemble-release-plan@6.0.3
  - @changesets/get-release-plan@4.0.3

## 2.27.6

### Patch Changes

- [#1392](https://github.com/changesets/changesets/pull/1392) [`f295b3e`](https://github.com/changesets/changesets/commit/f295b3e560233e2a800f62216febb7061ba66df3) Thanks [@bluwy](https://github.com/bluwy)! - Replace `meow` dependency with `mri` to reduce the number of transitive dependencies

- [#1390](https://github.com/changesets/changesets/pull/1390) [`6a3452e`](https://github.com/changesets/changesets/commit/6a3452ef1943bfb3a3018168b4b6c14af556fdef) Thanks [@bluwy](https://github.com/bluwy)! - Display `changeset status --verbose` in list form and remove `tty-table` dependency

## 2.27.5

### Patch Changes

- [#1370](https://github.com/changesets/changesets/pull/1370) [`5e9d33a`](https://github.com/changesets/changesets/commit/5e9d33a2e659abdcf26f204a76a9465cf4b26d6b) Thanks [@Andarist](https://github.com/Andarist)! - Fixed a regression that caused `changeset version` to fail on packages having a dev dependency on a skipped package.

- Updated dependencies [[`5e9d33a`](https://github.com/changesets/changesets/commit/5e9d33a2e659abdcf26f204a76a9465cf4b26d6b)]:
  - @changesets/get-dependents-graph@2.1.0
  - @changesets/assemble-release-plan@6.0.2
  - @changesets/config@3.0.1
  - @changesets/get-release-plan@4.0.2
  - @changesets/apply-release-plan@7.0.3

## 2.27.4

### Patch Changes

- [#1361](https://github.com/changesets/changesets/pull/1361) [`954a16a`](https://github.com/changesets/changesets/commit/954a16aa1d118a0f7fa745ffe0d19b304f685d4c) Thanks [@jakebailey](https://github.com/jakebailey)! - Version 2.25.0 introduced the `privatePackage` configuration option with default `{ version: false, tag: false }`; due to a bug, these options were not respected in all commands, leading to commands like `changeset tag` still tagging private packages. This has been fixed, and all packages now respect this option.

- [#1369](https://github.com/changesets/changesets/pull/1369) [`d729d8c`](https://github.com/changesets/changesets/commit/d729d8cc0e226871aa0c5b73cce80bbf313ca56c) Thanks [@Andarist](https://github.com/Andarist)! - `changeset tag` should now correctly skip tags that exist on the remote

- Updated dependencies [[`954a16a`](https://github.com/changesets/changesets/commit/954a16aa1d118a0f7fa745ffe0d19b304f685d4c)]:
  - @changesets/assemble-release-plan@6.0.1
  - @changesets/apply-release-plan@7.0.2
  - @changesets/get-release-plan@4.0.1

## 2.27.3

### Patch Changes

- [#1357](https://github.com/changesets/changesets/pull/1357) [`18c966a`](https://github.com/changesets/changesets/commit/18c966af7b20201453190cbfd2e2dfb59631c02c) Thanks [@Andarist](https://github.com/Andarist)! - Fixed an issue with `changeset status` executed without `since` argument. It should now correctly use the configured base branch as the default value.

## 2.27.2

### Patch Changes

- [#1354](https://github.com/changesets/changesets/pull/1354) [`69be7dc`](https://github.com/changesets/changesets/commit/69be7dc7195011ac6dbd00b24ea923f02adcf69c) Thanks [@Andarist](https://github.com/Andarist)! - Fixed an issue with `changeset status` incorrectly returning an error status in two cases:

  - for changed ignored packages
  - for changed private packages when `privatePackage.version` was set to `false`

- [#1351](https://github.com/changesets/changesets/pull/1351) [`c6da182`](https://github.com/changesets/changesets/commit/c6da182ece2ec40974f15f3efcf9d9ba20cf122b) Thanks [@TheHolyWaffle](https://github.com/TheHolyWaffle)! - Fix an issue with not applying a custom `.prettierrc` configuration with `prettier@>= 3.1.1`

- Updated dependencies [[`c6da182`](https://github.com/changesets/changesets/commit/c6da182ece2ec40974f15f3efcf9d9ba20cf122b)]:
  - @changesets/apply-release-plan@7.0.1
  - @changesets/write@0.3.1

## 2.27.1

### Patch Changes

- [#1267](https://github.com/changesets/changesets/pull/1267) [`86cfff1`](https://github.com/changesets/changesets/commit/86cfff1f1891e75238eec61dc97a303ad7a8c030) Thanks [@Andarist](https://github.com/Andarist)! - Make `./bin.js` available through `package.json#exports` to fix compatibility with `changesets/action`.

## 2.27.0

### Minor Changes

- [#1185](https://github.com/changesets/changesets/pull/1185) [`a971652`](https://github.com/changesets/changesets/commit/a971652ec1403aab3fb89eb2f1640bd5012b895a) Thanks [@Andarist](https://github.com/Andarist)! - `package.json#exports` have been added to limit what (and how) code might be imported from the package.

- [#1236](https://github.com/changesets/changesets/pull/1236) [`dfd4cca`](https://github.com/changesets/changesets/commit/dfd4cca84118df913feedfeac37a4939566ae447) Thanks [@camertron](https://github.com/camertron)! - Avoid using short commit IDs

### Patch Changes

- [#1053](https://github.com/changesets/changesets/pull/1053) [`90a870a`](https://github.com/changesets/changesets/commit/90a870af2e7bcbe1551210063492e20c256f4995) Thanks [@paescuj](https://github.com/paescuj)! - Replace the dependency `is-ci` with `ci-info`.

- Updated dependencies [[`a971652`](https://github.com/changesets/changesets/commit/a971652ec1403aab3fb89eb2f1640bd5012b895a), [`dfd4cca`](https://github.com/changesets/changesets/commit/dfd4cca84118df913feedfeac37a4939566ae447)]:
  - @changesets/assemble-release-plan@6.0.0
  - @changesets/get-dependents-graph@2.0.0
  - @changesets/apply-release-plan@7.0.0
  - @changesets/get-release-plan@4.0.0
  - @changesets/changelog-git@0.2.0
  - @changesets/config@3.0.0
  - @changesets/errors@0.2.0
  - @changesets/logger@0.1.0
  - @changesets/types@6.0.0
  - @changesets/write@0.3.0
  - @changesets/read@0.6.0
  - @changesets/git@3.0.0
  - @changesets/pre@2.0.0

## 2.26.2

### Patch Changes

- [#1176](https://github.com/changesets/changesets/pull/1176) [`41988ce`](https://github.com/changesets/changesets/commit/41988ceb8c1cedd3857c939448bf3965494ff0a4) Thanks [@joshwooding](https://github.com/joshwooding)! - Bump [`semver`](https://github.com/npm/node-semver) dependency to v7.5.3

- Updated dependencies [[`41988ce`](https://github.com/changesets/changesets/commit/41988ceb8c1cedd3857c939448bf3965494ff0a4)]:
  - @changesets/apply-release-plan@6.1.4
  - @changesets/assemble-release-plan@5.2.4
  - @changesets/get-dependents-graph@1.3.6
  - @changesets/get-release-plan@3.0.17
  - @changesets/config@2.3.1

## 2.26.1

### Patch Changes

- [#1115](https://github.com/changesets/changesets/pull/1115) [`feddc88`](https://github.com/changesets/changesets/commit/feddc88d74781a448855a5a0b0ffa50917489b15) Thanks [@Andarist](https://github.com/Andarist)! - Call `pnpm publish` directly from the directory of the published package. This allows `pnpm` to correctly handle configured `publishConfig.directory`.

## 2.26.0

### Minor Changes

- [#1033](https://github.com/changesets/changesets/pull/1033) [`521205d`](https://github.com/changesets/changesets/commit/521205dc8c70fe71b181bd3c4bb7c9c6d2e721d2) Thanks [@Andarist](https://github.com/Andarist)! - A new config-level `changedFilePatterns` option has been added. You can configure it with an array of glob patterns like here:

  ```json
  // .changeset/config.json
  {
    "changedFilePatterns": ["src/**"]
  }
  ```

  Files that do not match the configured pattern won't contribute to the "changed" status of the package to which they belong. This both affects `changesets add` and `changeset status`.

### Patch Changes

- Updated dependencies [[`598136a`](https://github.com/changesets/changesets/commit/598136a32a00b620c9521d7a7151fbbc721c17d7), [`521205d`](https://github.com/changesets/changesets/commit/521205dc8c70fe71b181bd3c4bb7c9c6d2e721d2), [`521205d`](https://github.com/changesets/changesets/commit/521205dc8c70fe71b181bd3c4bb7c9c6d2e721d2), [`598136a`](https://github.com/changesets/changesets/commit/598136a32a00b620c9521d7a7151fbbc721c17d7), [`598136a`](https://github.com/changesets/changesets/commit/598136a32a00b620c9521d7a7151fbbc721c17d7), [`521205d`](https://github.com/changesets/changesets/commit/521205dc8c70fe71b181bd3c4bb7c9c6d2e721d2)]:
  - @changesets/git@2.0.0
  - @changesets/config@2.3.0
  - @changesets/types@5.2.1
  - @changesets/apply-release-plan@6.1.3
  - @changesets/read@0.5.9
  - @changesets/assemble-release-plan@5.2.3
  - @changesets/get-release-plan@3.0.16
  - @changesets/changelog-git@0.1.14
  - @changesets/get-dependents-graph@1.3.5
  - @changesets/pre@1.0.14
  - @changesets/write@0.2.3

## 2.25.2

### Patch Changes

- Updated dependencies [[`6cc4300`](https://github.com/changesets/changesets/commit/6cc430013a052dc2488b9e6700a1e4bd8c8e0680)]:
  - @changesets/apply-release-plan@6.1.2
  - @changesets/write@0.2.2

## 2.25.1

### Patch Changes

- [#997](https://github.com/changesets/changesets/pull/997) [`4d4d67b`](https://github.com/changesets/changesets/commit/4d4d67b74f9de9dfdc78b9d3cf904c6b69b81ce5) Thanks [@JakeGinnivan](https://github.com/JakeGinnivan)! - Add error message when running changesets in a repo with workspaces configured but no packages yet

- [#985](https://github.com/changesets/changesets/pull/985) [`8d0115e`](https://github.com/changesets/changesets/commit/8d0115ea8b2b2e0c0072c8f69898e65a5a7aebd3) Thanks [@mino01x](https://github.com/mino01x)! - Fixed an issue with private packages with versions being included in the CLI prompt despite the `privatePackages.version: false` setting.

## 2.25.0

### Minor Changes

- [#662](https://github.com/changesets/changesets/pull/662) [`8c08469`](https://github.com/changesets/changesets/commit/8c0846977597ddaf51aaeb35f1f0f9428bf8ba14) Thanks [@JakeGinnivan](https://github.com/JakeGinnivan)! - Private packages can now be tagged in the same way public packages do when they are published to npm.

  To enable set `privatePackages: { version: true, tag: true }` in your config.json.

  You can also now opt private packages out of versioning entirely by setting `privatePackages: false`.

### Patch Changes

- [#953](https://github.com/changesets/changesets/pull/953) [`98d63e0`](https://github.com/changesets/changesets/commit/98d63e0a85506175e219b93478a814f8588c52d3) Thanks [@alexamy](https://github.com/alexamy)! - Add a new line at the end of the default config file generated when invoking `changeset init`.

- [#949](https://github.com/changesets/changesets/pull/949) [`64585ea`](https://github.com/changesets/changesets/commit/64585ea4323c4cf51a23b0635990b568d1f58b2b) Thanks [@Andarist](https://github.com/Andarist), [@BPScott](https://github.com/BPScott)! - Fixed the issue that caused transitive dependents of dev dependents to be bumped when a package got bumped and when using `___experimentalUnsafeOptions_WILL_CHANGE_IN_PATCH.updateInternalDependents: "always"`. To illustrate this with an example:

  ```
  pkg-a - version: 1.0.0
  pkg-b - devDependencies['pkg-a']: 1.0.0
  pkg-c - dependencies['pkg-b']: 1.0.0
  ```

  With a changeset for `pkg-a` the `pkg-c` could have been sometimes incorrectly released.

- Updated dependencies [[`8c08469`](https://github.com/changesets/changesets/commit/8c0846977597ddaf51aaeb35f1f0f9428bf8ba14), [`8c08469`](https://github.com/changesets/changesets/commit/8c0846977597ddaf51aaeb35f1f0f9428bf8ba14), [`64585ea`](https://github.com/changesets/changesets/commit/64585ea4323c4cf51a23b0635990b568d1f58b2b)]:
  - @changesets/git@1.5.0
  - @changesets/config@2.2.0
  - @changesets/types@5.2.0
  - @changesets/assemble-release-plan@5.2.2
  - @changesets/apply-release-plan@6.1.1
  - @changesets/read@0.5.8
  - @changesets/get-release-plan@3.0.15
  - @changesets/changelog-git@0.1.13
  - @changesets/get-dependents-graph@1.3.4
  - @changesets/pre@1.0.13
  - @changesets/write@0.2.1

## 2.24.4

### Patch Changes

- Updated dependencies [[`c140171`](https://github.com/changesets/changesets/commit/c1401716cf5ee839aaa02ea7ff8f23f8af8bf5b0)]:
  - @changesets/apply-release-plan@6.1.0
  - @changesets/write@0.2.0

## 2.24.3

### Patch Changes

- Updated dependencies [[`b023e4b`](https://github.com/changesets/changesets/commit/b023e4b3d1ad793a5dd1187b720e8103cebfb937)]:
  - @changesets/assemble-release-plan@5.2.1
  - @changesets/get-release-plan@3.0.14

## 2.24.2

### Patch Changes

- [#900](https://github.com/changesets/changesets/pull/900) [`7d998ee`](https://github.com/changesets/changesets/commit/7d998eeb16064b5442ebc49ad31dec7b841d504e) Thanks [@sdirosa](https://github.com/sdirosa)! - Fixed an issue with generating changelogs not being skipped when the `changelog` config option was set to `false`.

- [#720](https://github.com/changesets/changesets/pull/720) [`0fd56e1`](https://github.com/changesets/changesets/commit/0fd56e17092c7258de57adf7dd4ba08406c8e440) Thanks [@bhovhannes](https://github.com/bhovhannes)! - Private packages without a `version` field are no longer listed when adding a changeset.

- [#844](https://github.com/changesets/changesets/pull/844) [`8627ec1`](https://github.com/changesets/changesets/commit/8627ec1faba53644b366c314be248e1bba48f329) Thanks [@Andarist](https://github.com/Andarist)! - Attempt to log `stdout` when publish fails if `stderr` is empty and JSON error can't be retrieved from none of those.

- Updated dependencies [[`7d998ee`](https://github.com/changesets/changesets/commit/7d998eeb16064b5442ebc49ad31dec7b841d504e), [`7d998ee`](https://github.com/changesets/changesets/commit/7d998eeb16064b5442ebc49ad31dec7b841d504e)]:
  - @changesets/config@2.1.1
  - @changesets/apply-release-plan@6.0.4
  - @changesets/get-release-plan@3.0.13

## 2.24.1

### Patch Changes

- Updated dependencies [[`f64bc1b`](https://github.com/changesets/changesets/commit/f64bc1bb33457918eae34b22f214174ba3cf4504)]:
  - @changesets/git@1.4.1
  - @changesets/apply-release-plan@6.0.3
  - @changesets/read@0.5.7
  - @changesets/get-release-plan@3.0.12

## 2.24.0

### Minor Changes

- [#858](https://github.com/changesets/changesets/pull/858) [`dd9b76f`](https://github.com/changesets/changesets/commit/dd9b76f162a546ae8b412e0cb10277f971f3585e) Thanks [@dotansimha](https://github.com/dotansimha)! - Added a new config flag for `changesets version --snapshot` mode: `--snapshot-prerelease-template`

- [#858](https://github.com/changesets/changesets/pull/858) [`dd9b76f`](https://github.com/changesets/changesets/commit/dd9b76f162a546ae8b412e0cb10277f971f3585e) Thanks [@dotansimha](https://github.com/dotansimha)! - Added a new config option: `snapshot.prereleaseTemplate` for customizing the way snapshot release numbers are being composed.

### Patch Changes

- [#858](https://github.com/changesets/changesets/pull/858) [`dd9b76f`](https://github.com/changesets/changesets/commit/dd9b76f162a546ae8b412e0cb10277f971f3585e) Thanks [@dotansimha](https://github.com/dotansimha)! - A possibility to use the calculated version for snapshot releases is now stable 🥳 All snapshot-related config parameters are now grouped under a single config property called `snapshot`.

  To migrate, make sure to update your `config.json`.

  Old usage (still works, but comes with a deprecated warning):

  ```json
  {
    "___experimentalUnsafeOptions_WILL_CHANGE_IN_PATCH": {
      "useCalculatedVersionForSnapshots": true
    }
  }
  ```

  New usage:

  ```json
  {
    "snapshot": {
      "useCalculatedVersion": true
    }
  }
  ```

- Updated dependencies [[`dd9b76f`](https://github.com/changesets/changesets/commit/dd9b76f162a546ae8b412e0cb10277f971f3585e), [`dd9b76f`](https://github.com/changesets/changesets/commit/dd9b76f162a546ae8b412e0cb10277f971f3585e), [`dd9b76f`](https://github.com/changesets/changesets/commit/dd9b76f162a546ae8b412e0cb10277f971f3585e)]:
  - @changesets/config@2.1.0
  - @changesets/git@1.4.0
  - @changesets/assemble-release-plan@5.2.0
  - @changesets/types@5.1.0
  - @changesets/apply-release-plan@6.0.2
  - @changesets/get-release-plan@3.0.11
  - @changesets/read@0.5.6
  - @changesets/changelog-git@0.1.12
  - @changesets/get-dependents-graph@1.3.3
  - @changesets/pre@1.0.12
  - @changesets/write@0.1.9

## 2.23.2

### Patch Changes

- [#871](https://github.com/changesets/changesets/pull/871) [`e174172`](https://github.com/changesets/changesets/commit/e174172623854f0a86d87481222296d7bdcd9976) Thanks [@NicoKam](https://github.com/NicoKam)! - Fixed filtering of the ignored packages when adding a changeset.

## 2.23.1

### Patch Changes

- [#843](https://github.com/changesets/changesets/pull/843) [`101b1cb`](https://github.com/changesets/changesets/commit/101b1cb7e45f23146ce764a892a9ba04ed545cc5) Thanks [@caohuilin](https://github.com/caohuilin)! - Fixed the printed filename in the verbose output of `changeset status`.

- [#857](https://github.com/changesets/changesets/pull/857) [`7febb59`](https://github.com/changesets/changesets/commit/7febb599167234ae071b5d223b80cbc8a9375709) Thanks [@dotansimha](https://github.com/dotansimha)! - Fixed an issue with dependency ranges still using pre-existing range modifiers instead of fixed package versions when performing a snapshot release. This ensures that installs of snapshot versions are always reproducible.

- [#744](https://github.com/changesets/changesets/pull/744) [`84e46d1`](https://github.com/changesets/changesets/commit/84e46d19bd26c3a4ab6ff6d0543bd327dfa32a10) Thanks [@mskelton](https://github.com/mskelton)! - Ignored packages are no longer listed when adding a changeset.

- Updated dependencies [[`2827c7a`](https://github.com/changesets/changesets/commit/2827c7ab33af30065fafe72ede1a2a6ac88d5276), [`7b1c0c1`](https://github.com/changesets/changesets/commit/7b1c0c1b73a19b50fe3a104acb440c604eab108f), [`7febb59`](https://github.com/changesets/changesets/commit/7febb599167234ae071b5d223b80cbc8a9375709)]:
  - @changesets/config@2.0.1
  - @changesets/apply-release-plan@6.0.1
  - @changesets/get-release-plan@3.0.10

## 2.23.0

### Minor Changes

- [#796](https://github.com/changesets/changesets/pull/796) [`745b771`](https://github.com/changesets/changesets/commit/745b7713f6ab18c8f5ec0500ddcf1ce5db2377cf) Thanks [@JakeGinnivan](https://github.com/JakeGinnivan)! - Upgraded `tty-table` to fix deprecation warnings coming from its transitive dependency.

### Patch Changes

- [#811](https://github.com/changesets/changesets/pull/811) [`c54c25d`](https://github.com/changesets/changesets/commit/c54c25d7bbbdc055d2df97396c3b73e66f8b3b78) Thanks [@samrose3](https://github.com/samrose3)! - Improved accessibility of the CLI prompts by using selected/unselected indicators that don't rely solely on the colors.

- [#767](https://github.com/changesets/changesets/pull/767) [`d6bfcc5`](https://github.com/changesets/changesets/commit/d6bfcc5052dcba18c521a20d62e2e67a81819112) Thanks [@Andarist](https://github.com/Andarist)! - Improve the error message when a package referenced in a changeset can't be found. The message will now also include the changeset's ID.

- Updated dependencies [[`d6bfcc5`](https://github.com/changesets/changesets/commit/d6bfcc5052dcba18c521a20d62e2e67a81819112)]:
  - @changesets/assemble-release-plan@5.1.3
  - @changesets/get-release-plan@3.0.9

## 2.22.0

### Minor Changes

- [#768](https://github.com/changesets/changesets/pull/768) [`c87eba6`](https://github.com/changesets/changesets/commit/c87eba6f80a34563b7382f87472c29f6dafb546c) Thanks [@rohit-gohri](https://github.com/rohit-gohri)! - Allow `"commit"` option to be more configurable. You can now point to a module (using a module name or a relative path) that might contain `getAddMessage` and/or `getVersionMessage`. This allows you to configure how the commit message is generated, if `[skip ci]` gets included, etc.

### Patch Changes

- [#776](https://github.com/changesets/changesets/pull/776) [`ad7506d`](https://github.com/changesets/changesets/commit/ad7506dc6973293a6f913653c2a6a15ba5b8b500) Thanks [@janosh](https://github.com/janosh)! - `changeset init` will now configure `baseBranch: "main"` in the `.changeset/config.json` as the default value.

- [#770](https://github.com/changesets/changesets/pull/770) [`eb86652`](https://github.com/changesets/changesets/commit/eb86652cbd21c49f90d2a03caa9a578593c4d102) Thanks [@alizeait](https://github.com/alizeait)! - `changeset add` and `changeset status` should now properly handle the situation where Changesets are managed from a directory different than the root of the repository.

- Updated dependencies [[`c87eba6`](https://github.com/changesets/changesets/commit/c87eba6f80a34563b7382f87472c29f6dafb546c), [`eb86652`](https://github.com/changesets/changesets/commit/eb86652cbd21c49f90d2a03caa9a578593c4d102), [`c87eba6`](https://github.com/changesets/changesets/commit/c87eba6f80a34563b7382f87472c29f6dafb546c), [`c87eba6`](https://github.com/changesets/changesets/commit/c87eba6f80a34563b7382f87472c29f6dafb546c)]:
  - @changesets/types@5.0.0
  - @changesets/git@1.3.2
  - @changesets/apply-release-plan@6.0.0
  - @changesets/config@2.0.0
  - @changesets/assemble-release-plan@5.1.2
  - @changesets/changelog-git@0.1.11
  - @changesets/get-dependents-graph@1.3.2
  - @changesets/get-release-plan@3.0.8
  - @changesets/pre@1.0.11
  - @changesets/read@0.5.5
  - @changesets/write@0.1.8

## 2.21.1

### Patch Changes

- [#760](https://github.com/changesets/changesets/pull/760) [`5a2a59a`](https://github.com/changesets/changesets/commit/5a2a59a37b7fb31e17414579b470402d3016e28e) Thanks [@Andarist](https://github.com/Andarist)! - Fixed an issue with logging non-stringified Buffers in case of publish errors.

- [#769](https://github.com/changesets/changesets/pull/769) [`3e8e672`](https://github.com/changesets/changesets/commit/3e8e6721d31f80fff28826e0fad2c14216c3d94f) Thanks [@Andarist](https://github.com/Andarist)! - Fixed an infinite loop involving a fixed group of packages and a package within that group that was both ignored and dependent on another package from that group.

- Updated dependencies [[`3e8e672`](https://github.com/changesets/changesets/commit/3e8e6721d31f80fff28826e0fad2c14216c3d94f)]:
  - @changesets/assemble-release-plan@5.1.1
  - @changesets/get-release-plan@3.0.7

## 2.21.0

### Minor Changes

- [#690](https://github.com/changesets/changesets/pull/690) [`27a5a82`](https://github.com/changesets/changesets/commit/27a5a82188914570d192162f9d045dfd082a3c15) Thanks [@Andarist](https://github.com/Andarist)! - Added a new `.changeset/config.json` option: `fixed`. It can be used to group packages that should always be released together. If any package from a group is going to be released then all packages from that group will be released together (with the same version).

  This is similar to what people often know from Lerna as this is how their fixed/locked mode works.

### Patch Changes

- [#706](https://github.com/changesets/changesets/pull/706) [`0812858`](https://github.com/changesets/changesets/commit/0812858996045e602d22f2b7dd13e8673e3b36b0) Thanks [@Andarist](https://github.com/Andarist)! - Fixed an issue with `"none"` releases causing package versions being bumped during snapshot releases. In addition to when you create `"none"` release types explicitly Changesets might create them implicitly in some situations, for example under some circumstances this issue caused snapshot releases to be created sometimes for ignored packages.

- [#703](https://github.com/changesets/changesets/pull/703) [`15c461d`](https://github.com/changesets/changesets/commit/15c461d5de94a274ccc8b33755a133a513339b0a) Thanks [@Andarist](https://github.com/Andarist)! - Fixed an issue with `*` dependency ranges not being replaced in premode. Those have to replaced with exact versions because prereleases don't satisfy wildcard ranges. A published prerelease package with such dependency range left untouched won't install correct prerelease dependency version.

- [#749](https://github.com/changesets/changesets/pull/749) [`d14cf79`](https://github.com/changesets/changesets/commit/d14cf79fd323529c6fe6ca956d9a7fda93bb425b) Thanks [@Andarist](https://github.com/Andarist)! - Fixed an issue that caused **created** CHANGELOG files not being formatted in the same way as the **updated** ones (this could happen when calling `changeset version` for the very first time for a package).

- [#751](https://github.com/changesets/changesets/pull/751) [`59c7ebc`](https://github.com/changesets/changesets/commit/59c7ebc7a5e75f69f5487e95a85cd1b7062ac39d) Thanks [@Rugvip](https://github.com/Rugvip)! - Fixed an issue where dependent packages would sometimes not get bumped properly when exiting prerelease mode.

- [#703](https://github.com/changesets/changesets/pull/703) [`15c461d`](https://github.com/changesets/changesets/commit/15c461d5de94a274ccc8b33755a133a513339b0a) Thanks [@Andarist](https://github.com/Andarist)! - Fixed an issue with dependant packages being always bumped when their `*` dependency was bumped.

- Updated dependencies [[`0812858`](https://github.com/changesets/changesets/commit/0812858996045e602d22f2b7dd13e8673e3b36b0), [`15c461d`](https://github.com/changesets/changesets/commit/15c461d5de94a274ccc8b33755a133a513339b0a), [`27a5a82`](https://github.com/changesets/changesets/commit/27a5a82188914570d192162f9d045dfd082a3c15), [`27a5a82`](https://github.com/changesets/changesets/commit/27a5a82188914570d192162f9d045dfd082a3c15), [`d14cf79`](https://github.com/changesets/changesets/commit/d14cf79fd323529c6fe6ca956d9a7fda93bb425b), [`27a5a82`](https://github.com/changesets/changesets/commit/27a5a82188914570d192162f9d045dfd082a3c15), [`0d1debd`](https://github.com/changesets/changesets/commit/0d1debd8f5d364073d627a017316a25554dec4d5), [`59c7ebc`](https://github.com/changesets/changesets/commit/59c7ebc7a5e75f69f5487e95a85cd1b7062ac39d), [`15c461d`](https://github.com/changesets/changesets/commit/15c461d5de94a274ccc8b33755a133a513339b0a)]:
  - @changesets/assemble-release-plan@5.1.0
  - @changesets/apply-release-plan@5.0.5
  - @changesets/types@4.1.0
  - @changesets/config@1.7.0
  - @changesets/changelog-git@0.1.10
  - @changesets/get-release-plan@3.0.6
  - @changesets/get-dependents-graph@1.3.1
  - @changesets/git@1.3.1
  - @changesets/pre@1.0.10
  - @changesets/read@0.5.4
  - @changesets/write@0.1.7

## 2.20.0

### Minor Changes

- [#698](https://github.com/changesets/changesets/pull/698) [`9e14a9a`](https://github.com/changesets/changesets/commit/9e14a9a89d337bfcf4c0472989ed1f46f70a2627) Thanks [@zthxxx](https://github.com/zthxxx)! - Reworked the CLI output when adding a changeset. This includes fixing broken formatting in certain terminal width, reducing visual noise and making other small adjustments.

- [#704](https://github.com/changesets/changesets/pull/704) [`6f9c9d6`](https://github.com/changesets/changesets/commit/6f9c9d60c0e02c79d555c48deb01559057f1d252) Thanks [@Andarist](https://github.com/Andarist)! - Dependencies specified using a tag will no longer result in printing incorrect errors in the console.

### Patch Changes

- [#740](https://github.com/changesets/changesets/pull/740) [`957e39c`](https://github.com/changesets/changesets/commit/957e39c21549dd91e03faa5cd30e44e4c3d7331f) Thanks [@akphi](https://github.com/akphi)! - Fixed an issue with failing to parse changesets containing a completely empty summary.

- [#693](https://github.com/changesets/changesets/pull/693) [`1be201f`](https://github.com/changesets/changesets/commit/1be201fc27903cb2f42137400b5484c4ccad3812) Thanks [@luciaquirke](https://github.com/luciaquirke)! - Fixed an issue with `none` release type sometimes overriding other release types and thus preventing a release from happening.

- Updated dependencies [[`6f9c9d6`](https://github.com/changesets/changesets/commit/6f9c9d60c0e02c79d555c48deb01559057f1d252), [`77c1cef`](https://github.com/changesets/changesets/commit/77c1ceff402f390c1ededec358d914ba68a31d0d), [`1be201f`](https://github.com/changesets/changesets/commit/1be201fc27903cb2f42137400b5484c4ccad3812)]:
  - @changesets/get-dependents-graph@1.3.0
  - @changesets/git@1.3.0
  - @changesets/assemble-release-plan@5.0.5
  - @changesets/config@1.6.4
  - @changesets/apply-release-plan@5.0.4
  - @changesets/read@0.5.3
  - @changesets/get-release-plan@3.0.5

## 2.19.0

### Minor Changes

- [#701](https://github.com/changesets/changesets/pull/701) [`b9b6453`](https://github.com/changesets/changesets/commit/b9b6453b16ada9751e2280b5230ded72161391e9) Thanks [@Andarist](https://github.com/Andarist)! - Added support for a `--no-git-tag` CLI flag that can be used with `changeset publish` to skip creating git tags for published packages. This is mostly useful when publishing snapshot releases.

### Patch Changes

- [#713](https://github.com/changesets/changesets/pull/713) [`82be80e`](https://github.com/changesets/changesets/commit/82be80ecfe9288535071e850ae56f2e7a7006eba) Thanks [@zthxxx](https://github.com/zthxxx)! - Fixed an issue with not being able to reenter exited pre mode.

- [#708](https://github.com/changesets/changesets/pull/708) [`ab8f2b2`](https://github.com/changesets/changesets/commit/ab8f2b29d5cf921d97987a665051b67a7ec55ed3) Thanks [@Andarist](https://github.com/Andarist)! - Updated [`is-ci`](https://github.com/watson/is-ci) dependency that helps us to check if Changesets are executed in the CI environment.

- [#710](https://github.com/changesets/changesets/pull/710) [`4272cb0`](https://github.com/changesets/changesets/commit/4272cb0eca8b24857b4832df4ae7300befe6feb2) Thanks [@Andarist](https://github.com/Andarist)! - Errors received from `npm profile get --json`, that is used to check if 2FA is required, will now always be printed.

- Updated dependencies [[`82be80e`](https://github.com/changesets/changesets/commit/82be80ecfe9288535071e850ae56f2e7a7006eba), [`e4c4b29`](https://github.com/changesets/changesets/commit/e4c4b2934beee9b25a927b4ae1b7280f4323d4ff)]:
  - @changesets/pre@1.0.9
  - @changesets/assemble-release-plan@5.0.4
  - @changesets/get-release-plan@3.0.4

## 2.18.1

### Patch Changes

- [#676](https://github.com/changesets/changesets/pull/676) [`d8f0e68`](https://github.com/changesets/changesets/commit/d8f0e6851bddf307b70b03e23b50e0b9410aafa7) Thanks [@Andarist](https://github.com/Andarist)! - Improved compatibility with npm 7+ since they've started to print errors to the `stderr` (where previously they were printed to `stdout`) when using `npm publish --json`.

- [#676](https://github.com/changesets/changesets/pull/676) [`d8f0e68`](https://github.com/changesets/changesets/commit/d8f0e6851bddf307b70b03e23b50e0b9410aafa7) Thanks [@Andarist](https://github.com/Andarist)! - Fixed an internal issue that prevented `npm publish --json`'s output to be handled properly. This makes sure that unrelated JSONs printed by lifecycle scripts don't interfere with our logic.

- [#667](https://github.com/changesets/changesets/pull/667) [`fe8db75`](https://github.com/changesets/changesets/commit/fe8db7500f81caea9064f8bec02bcb77e0fd8fce) Thanks [@fz6m](https://github.com/fz6m)! - Upgraded `@manypkg/get-packages` dependency to fix getting correct packages in pnpm workspaces with exclude rules.

- Updated dependencies [[`fe8db75`](https://github.com/changesets/changesets/commit/fe8db7500f81caea9064f8bec02bcb77e0fd8fce), [`9a993ba`](https://github.com/changesets/changesets/commit/9a993ba09629c1620d749432520470cec49d3a96)]:
  - @changesets/apply-release-plan@5.0.3
  - @changesets/assemble-release-plan@5.0.3
  - @changesets/config@1.6.3
  - @changesets/get-dependents-graph@1.2.4
  - @changesets/get-release-plan@3.0.3
  - @changesets/git@1.2.1
  - @changesets/pre@1.0.8
  - @changesets/types@4.0.2
  - @changesets/read@0.5.2
  - @changesets/write@0.1.6

## 2.18.0

### Minor Changes

- [#634](https://github.com/changesets/changesets/pull/634) [`2b49c39`](https://github.com/changesets/changesets/commit/2b49c390a7cf24ce859ac932b432eb6d8f55c98b) Thanks [@joeldenning](https://github.com/joeldenning)! - The new `changeset tag` command has been added. It can be used to create git tags for all packages.

  This is helpful in situations where a different tool is used to publish packages instead of Changesets. For situations where `changeset publish` is executed, running `changeset tag` is not needed.

  Note that it is expected that `changeset version` is run before `changeset tag`, so that the `package.json` versions are updated before the git tags are created. This command also doesn't take any configuration into account - it simply create tags for all packages with whatever version that is currently in their respective `package.json`.

### Patch Changes

- [#585](https://github.com/changesets/changesets/pull/585) [`74dda8c`](https://github.com/changesets/changesets/commit/74dda8c0d8bd1741ca7b19f0ccb37b2330dc9549) Thanks [@javier-garcia-meteologica](https://github.com/javier-garcia-meteologica)! - Add support for `workspace:^` and `workspace:~` dependency ranges.

- [#660](https://github.com/changesets/changesets/pull/660) [`5413f3e`](https://github.com/changesets/changesets/commit/5413f3e772bf867234922b0691e3c58c1864412d) Thanks [@tmkx](https://github.com/tmkx)! - Fixed an issue with adding `[undefined]` to the generated changelog when the commit adding a changeset file could not be found. This could have happened when running `changeset add && changeset version` in a single command and when using the default changelog generator.

- Updated dependencies [[`2b49c39`](https://github.com/changesets/changesets/commit/2b49c390a7cf24ce859ac932b432eb6d8f55c98b), [`74dda8c`](https://github.com/changesets/changesets/commit/74dda8c0d8bd1741ca7b19f0ccb37b2330dc9549)]:
  - @changesets/git@1.2.0
  - @changesets/apply-release-plan@5.0.2
  - @changesets/get-dependents-graph@1.2.3
  - @changesets/read@0.5.1
  - @changesets/assemble-release-plan@5.0.2
  - @changesets/config@1.6.2
  - @changesets/get-release-plan@3.0.2

## 2.17.0

### Minor Changes

- [#626](https://github.com/changesets/changesets/pull/626) [`bc611cf`](https://github.com/changesets/changesets/commit/bc611cf2104ff8170e9ea8acb10952ea8cc2a784) Thanks [@Andarist](https://github.com/Andarist)! - From now on, changeset files starting with a dot (e.g. `.ignored-temporarily.md`) will be be ignored and kept around after versioning. This allows you to prepare a changeset for something that isn't supposed to be released immediately. An example use case could involve code hidden behind a feature flag.

### Patch Changes

- [#582](https://github.com/changesets/changesets/pull/582) [`e89e28a`](https://github.com/changesets/changesets/commit/e89e28a05f5fa43307db73812a6bcd269b62ddee) Thanks [@Andarist](https://github.com/Andarist)! - Add support for publishConfig.registry

- Updated dependencies [[`bc611cf`](https://github.com/changesets/changesets/commit/bc611cf2104ff8170e9ea8acb10952ea8cc2a784), [`e89e28a`](https://github.com/changesets/changesets/commit/e89e28a05f5fa43307db73812a6bcd269b62ddee)]:
  - @changesets/read@0.5.0
  - @changesets/types@4.0.1
  - @changesets/get-release-plan@3.0.1
  - @changesets/apply-release-plan@5.0.1
  - @changesets/assemble-release-plan@5.0.1
  - @changesets/config@1.6.1
  - @changesets/get-dependents-graph@1.2.2
  - @changesets/git@1.1.2
  - @changesets/pre@1.0.7
  - @changesets/write@0.1.5

## 2.16.0

### Minor Changes

- [#542](https://github.com/changesets/changesets/pull/542) [`de2b4a5`](https://github.com/changesets/changesets/commit/de2b4a5a7b244a37d94625bcb70ecde9dde5b612) Thanks [@Andarist](https://github.com/Andarist)! - A new `updateInternalDependents` experimental option has been added. It can be used to add dependent packages to the release (if they are not already a part of it) with patch bumps. To use it you can add this to your config:

  ```json
  {
    "___experimentalUnsafeOptions_WILL_CHANGE_IN_PATCH": {
      "updateInternalDependents": "always"
    }
  }
  ```

  This option accepts two values - `"always"` and `"out-of-range"` (the latter matches the current default behavior).

- [#562](https://github.com/changesets/changesets/pull/562) [`6353abf`](https://github.com/changesets/changesets/commit/6353abf925d13c41feb1884124ddb5edc8c33555) Thanks [@Andarist](https://github.com/Andarist)! - Stop asking for changeset confirmation when it has been provided using an external editor.

### Patch Changes

- Updated dependencies [[`de2b4a5`](https://github.com/changesets/changesets/commit/de2b4a5a7b244a37d94625bcb70ecde9dde5b612), [`de2b4a5`](https://github.com/changesets/changesets/commit/de2b4a5a7b244a37d94625bcb70ecde9dde5b612)]:
  - @changesets/config@1.6.0
  - @changesets/types@4.0.0
  - @changesets/apply-release-plan@5.0.0
  - @changesets/assemble-release-plan@5.0.0
  - @changesets/get-release-plan@3.0.0
  - @changesets/get-dependents-graph@1.2.1
  - @changesets/git@1.1.1
  - @changesets/pre@1.0.6
  - @changesets/read@0.4.7
  - @changesets/write@0.1.4

## 2.15.0

### Minor Changes

- [#559](https://github.com/changesets/changesets/pull/559) [`bb7106d`](https://github.com/changesets/changesets/commit/bb7106de901b579bff50b317f1ee81919257ee30) Thanks [@Andarist](https://github.com/Andarist)! - Added new `--open` flag to the `add` command. It opens the created changeset with an external editor.

### Patch Changes

- Updated dependencies [[`8b9ac07`](https://github.com/changesets/changesets/commit/8b9ac076a87eaf9556ec5ede0222a75182095662)]:
  - @changesets/assemble-release-plan@4.1.1

## 2.14.1

### Patch Changes

- [`9224385`](https://github.com/changesets/changesets/commit/92243856c1ccede60202b456e3eb1a6458a47ac7) [#522](https://github.com/changesets/changesets/pull/522) Thanks [@emmenko](https://github.com/emmenko)! - Limit concurrency of publishing packages.

## 2.14.0

### Minor Changes

- [`12f9a43`](https://github.com/changesets/changesets/commit/12f9a433a6c3ac38f9405fcd77c9108c423d7101) [#507](https://github.com/changesets/changesets/pull/507) Thanks [@zkochan](https://github.com/zkochan)! - New setting added: bumpVersionsWithWorkspaceProtocolOnly. When it is set to `true`, versions are bumped in `dependencies`, only if those versions are prefixed by the workspace protocol. For instance, `"foo": "workspace:^1.0.0"`.

### Patch Changes

- Updated dependencies [[`12f9a43`](https://github.com/changesets/changesets/commit/12f9a433a6c3ac38f9405fcd77c9108c423d7101)]:
  - @changesets/apply-release-plan@4.2.0
  - @changesets/assemble-release-plan@4.1.0
  - @changesets/config@1.5.0
  - @changesets/get-dependents-graph@1.2.0
  - @changesets/types@3.3.0

## 2.13.1

### Patch Changes

- [`0d5b9e1`](https://github.com/changesets/changesets/commit/0d5b9e1f709f568ff9c2b28d4c12674b6b8c119d) [#518](https://github.com/changesets/changesets/pull/518) Thanks [@zkochan](https://github.com/zkochan)! - From now on, to fix issues with some auto-save configurations in IDEs, the editor won't be re-opened if one saves an empty summary. In such a scenario the CLI will prompt again for the summary to be written in the terminal.

## 2.13.0

### Minor Changes

- [`412b4b9`](https://github.com/changesets/changesets/commit/412b4b97e53b6326e8e733eb7d4e1f5738e6fed0) [#504](https://github.com/changesets/changesets/pull/504) Thanks [@vitorbal](https://github.com/vitorbal)! - `changeset status` command no longer errors when no packages have been changed.

- [`24d7bc9`](https://github.com/changesets/changesets/commit/24d7bc9e56a6dce7c64b39e8f73e50e21762faac) [#495](https://github.com/changesets/changesets/pull/495) Thanks [@RoystonS](https://github.com/RoystonS)! - Automatically deepen shallow clones in order to determine the correct commit at which changesets were added. This helps Git-based changelog generators to always link to the correct commit. From now on it's not required to configure `fetch-depth: 0` for your `actions/checkout` when using [Changesets GitHub action](https://github.com/changesets/action).

### Patch Changes

- Updated dependencies [[`24d7bc9`](https://github.com/changesets/changesets/commit/24d7bc9e56a6dce7c64b39e8f73e50e21762faac), [`24d7bc9`](https://github.com/changesets/changesets/commit/24d7bc9e56a6dce7c64b39e8f73e50e21762faac)]:
  - @changesets/git@1.1.0

## 2.12.0

### Minor Changes

- [`c6d38b5`](https://github.com/changesets/changesets/commit/c6d38b579bdfddc22714c352c3459d04d1745326) [#469](https://github.com/changesets/changesets/pull/469) Thanks [@camdub](https://github.com/camdub)! - Handle JSON errors for unpublished packages on the github package registry

## 2.11.2

### Patch Changes

- [`b4e4b93`](https://github.com/changesets/changesets/commit/b4e4b938b985b4bcdd23c573bcaba81669f2cafe) [#448](https://github.com/changesets/changesets/pull/448) Thanks [@vlad-zhukov](https://github.com/vlad-zhukov)! - Packages are now published from cwd (usually the root of the repository) rather than from the package directories. This respects `.npmrc` files put in the root directory.

## 2.11.1

### Patch Changes

- [`00e2602`](https://github.com/changesets/changesets/commit/00e2602815851c8f17f1115c354d19aab6583f96) [#473](https://github.com/changesets/changesets/pull/473) Thanks [@zzarcon](https://github.com/zzarcon)! - Upgraded [`meow`](https://github.com/sindresorhus/meow) dependency to benefit from its [`yarg-parser`](https://github.com/yargs/yargs-parser) dependency upgrade that contains a security fix.

## 2.11.0

### Minor Changes

- [`e33e4ca`](https://github.com/changesets/changesets/commit/e33e4ca7e71ba7747e21af5011057f11ddfab939) [#458](https://github.com/changesets/changesets/pull/458) Thanks [@emmenko](https://github.com/emmenko)! - Allow glob expressions to be provided for the `linked` and `ignore` options

### Patch Changes

- [`a60c0e1`](https://github.com/changesets/changesets/commit/a60c0e1557ccdc3a9e7f665dd679c223f64450fe) [#465](https://github.com/changesets/changesets/pull/465) Thanks [@Andarist](https://github.com/Andarist)! - Fixed the printed description of how `pre` command can be used.

- Updated dependencies [[`f4973a2`](https://github.com/changesets/changesets/commit/f4973a25ec6a837f36d64c1fb4b108ace3bc1f9d), [`e33e4ca`](https://github.com/changesets/changesets/commit/e33e4ca7e71ba7747e21af5011057f11ddfab939)]:
  - @changesets/types@3.2.0
  - @changesets/config@1.4.0

## 2.10.3

### Patch Changes

- [`d1d987c`](https://github.com/changesets/changesets/commit/d1d987c42cddff8be5d7f04d3ebb5a262779fa9f) [#455](https://github.com/changesets/changesets/pull/455) Thanks [@Andarist](https://github.com/Andarist)! - Fixed an issue with linked package being bumped when its dev dependency from the linked set was bumped during the versioning.

- [`9d99bd1`](https://github.com/changesets/changesets/commit/9d99bd16f2b6b3ab4fe820358d4c9f313cb2ae76) [#446](https://github.com/changesets/changesets/pull/446) Thanks [@Andarist](https://github.com/Andarist)! - Fixed an issue with dependent packages not being updated to their highest bump type in pre mode sometimes. This could happen when dependent packages were only versioned because of their dependencies being upgraded and not because of a dedicated changeset for those dependent packages.

  For the very same reason linked packages were also not always bumped correctly in pre mode to the highest bump type in a linked group.

- Updated dependencies [[`ab98fe3`](https://github.com/changesets/changesets/commit/ab98fe33814867ba740fc04733602be80771915c), [`d1d987c`](https://github.com/changesets/changesets/commit/d1d987c42cddff8be5d7f04d3ebb5a262779fa9f), [`9d99bd1`](https://github.com/changesets/changesets/commit/9d99bd16f2b6b3ab4fe820358d4c9f313cb2ae76)]:
  - @changesets/assemble-release-plan@4.0.0
  - @changesets/get-release-plan@2.0.1

## 2.10.2

### Patch Changes

- [`d531dbd`](https://github.com/changesets/changesets/commit/d531dbdc9ac22faccb20356e9ea1313e5095cf9d) [#412](https://github.com/changesets/changesets/pull/412) Thanks [@Feiyang1](https://github.com/Feiyang1)! - Fixed an issue with the same package specified as a different dependency type with different range types not being updated correctly for all of them.

- Updated dependencies [[`d531dbd`](https://github.com/changesets/changesets/commit/d531dbdc9ac22faccb20356e9ea1313e5095cf9d)]:
  - @changesets/assemble-release-plan@3.0.1

## 2.10.1

### Patch Changes

- [`efd01d9`](https://github.com/changesets/changesets/commit/efd01d9b7a46ba2a44df1f5fdb47436e9219f44b) [#437](https://github.com/changesets/changesets/pull/437) Thanks [@Blasz](https://github.com/Blasz)! - Fix version command not committing when commit config option is set

## 2.10.0

### Minor Changes

- [`dca4a91`](https://github.com/changesets/changesets/commit/dca4a91506dfca46915f7d4e833205ad3a685aa0) [#357](https://github.com/changesets/changesets/pull/357) Thanks [@zkochan](https://github.com/zkochan)! - Open an editor when no message is given when creating a changeset

- [`a57d163`](https://github.com/changesets/changesets/commit/a57d16355ad7d67b18b768c8f79224d80afa507c) [#428](https://github.com/changesets/changesets/pull/428) Thanks [@dotansimha](https://github.com/dotansimha)! - Added support for publishing from a subdirectory of packages, using `publishConfig.directory` field

### Patch Changes

- [`868eb1e`](https://github.com/changesets/changesets/commit/868eb1e68ee91aabefa04a9abf13a7fc22eef019) [#434](https://github.com/changesets/changesets/pull/434) Thanks [@mitchellhamilton](https://github.com/mitchellhamilton)! - Add `--no-git-checks` to `pnpm publish` in `changeset publish` to resolve issues with publishing on CI

- Updated dependencies [[`1dd3117`](https://github.com/changesets/changesets/commit/1dd311708c65321e1a1c99d36129190f940435ed), [`a57d163`](https://github.com/changesets/changesets/commit/a57d16355ad7d67b18b768c8f79224d80afa507c)]:
  - @changesets/git@1.0.6
  - @changesets/types@3.1.1

## 2.9.2

### Patch Changes

- [`213de26`](https://github.com/changesets/changesets/commit/213de26502c702b9e25ac3f4a04ea8e9099a5185) [#409](https://github.com/changesets/changesets/pull/409) Thanks [@Andarist](https://github.com/Andarist)! - Add logs for failed `JSON.parse` calls.

## 2.9.1

### Patch Changes

- [`377f5c3`](https://github.com/changesets/changesets/commit/377f5c385ad9db4ff8458f159e2d452c39828567) [#393](https://github.com/changesets/changesets/pull/393) Thanks [@Andarist](https://github.com/Andarist)! - Fixed an issue with experimental flags being written to disk as part of the default config when initializing Changesets.

- Updated dependencies [[`377f5c3`](https://github.com/changesets/changesets/commit/377f5c385ad9db4ff8458f159e2d452c39828567), [`377f5c3`](https://github.com/changesets/changesets/commit/377f5c385ad9db4ff8458f159e2d452c39828567)]:
  - @changesets/config@1.3.0

## 2.9.0

### Minor Changes

- [`9006375`](https://github.com/changesets/changesets/commit/90063752a4c4f187fcb3dc30c833405f209d9c84) [#392](https://github.com/changesets/changesets/pull/392) Thanks [@Andarist](https://github.com/Andarist)! - Changed condition based on which single-package repositories are identified when creating tags after successful publish. It is now based on whether we have recognized the repository to be managed by monorepo tooling or not.

- [`9dcc364`](https://github.com/changesets/changesets/commit/9dcc364bf19e48f8f2824ebaf967d9ef41b6fc04) [#371](https://github.com/changesets/changesets/pull/371) Thanks [@Feiyang1](https://github.com/Feiyang1)! - Added support for ignoring packages in the `version` command. The version of ignored packages will not be bumped, but their dependencies will still be bumped normally. This is useful when you have private packages, e.g. packages under development. It allows you to make releases for the public packages without changing the version of your private packages. To use the feature, you can define the `ignore` array in the config file with the name of the packages:

  ```
  {
    ...
    "ignore": ["pkg-a", "pkg-b"]
    ...
  }
  ```

  or you can pass the package names to the `--ignore` flag when using cli:

  ```
  yarn changeset version --ignore pkg-a --ignore --pkg-b
  ```

### Patch Changes

- Updated dependencies [[`00e768e`](https://github.com/changesets/changesets/commit/00e768e4af921a894debb900f944d4c9a4e27997), [`addd725`](https://github.com/changesets/changesets/commit/addd7256d9251d999251a7c16c0a0b068d557b5d), [`9dcc364`](https://github.com/changesets/changesets/commit/9dcc364bf19e48f8f2824ebaf967d9ef41b6fc04), [`9dcc364`](https://github.com/changesets/changesets/commit/9dcc364bf19e48f8f2824ebaf967d9ef41b6fc04)]:
  - @changesets/assemble-release-plan@3.0.0
  - @changesets/apply-release-plan@4.0.0
  - @changesets/get-release-plan@2.0.0
  - @changesets/config@1.2.0
  - @changesets/types@3.1.0

## 2.8.0

### Minor Changes

- [`6d0790a`](https://github.com/changesets/changesets/commit/6d0790a7aa9f00e350e9394f419e4b3c7ee7ca6a) [#359](https://github.com/changesets/changesets/pull/359) Thanks [@ajaymathur](https://github.com/ajaymathur)! - Add support for snapshot flag to version command. Usage: `changeset version --snapshot [tag]`. The updated version of the packages looks like `0.0.0[-tag]-YYYYMMDDHHMMSS` where YYYY, MM, DD, HH, MM, and SS is the date and time of when the snapshot version is created. You can use this feature with the tag option in the publish command to publish packages under experimental tags from feature branches. To publish a snapshot version of a package under an experimental tag you can do:

  ```
  # Version packages to snapshot version
  changeset version --snapshot
  # Publish packages under experimental tag, keeping next and latest tag clean
  changeset publish --tag experimental
  ```

- [`6d0790a`](https://github.com/changesets/changesets/commit/6d0790a7aa9f00e350e9394f419e4b3c7ee7ca6a) [#359](https://github.com/changesets/changesets/pull/359) Thanks [@ajaymathur](https://github.com/ajaymathur)! - Add support for tag flag to publish command. Usage: `changeset publish --tag <tag>`. This will publish the packages under passed npm tag.

- [`5dc389f`](https://github.com/changesets/changesets/commit/5dc389f9cc03a59ef44f34243efe8ad00e35d465) [#376](https://github.com/changesets/changesets/pull/376) Thanks [@Andarist](https://github.com/Andarist)! - Changed what git tag is generated for single-package repositories after successful publish. The package name is being skipped and the scheme matches what `npm version` generates, so for example `v2.8.0`.

### Patch Changes

- Updated dependencies [[`6d0790a`](https://github.com/changesets/changesets/commit/6d0790a7aa9f00e350e9394f419e4b3c7ee7ca6a)]:
  - @changesets/apply-release-plan@3.1.0
  - @changesets/assemble-release-plan@2.1.0

## 2.7.2

### Patch Changes

- [`8040173`](https://github.com/changesets/changesets/commit/80401737fddfc687f15e3d71dec967a6498317ea) [#368](https://github.com/changesets/changesets/pull/368) Thanks [@Andarist](https://github.com/Andarist)! - When logging successful releases and creating tags include an information about those being git tags.

- [`90f3b65`](https://github.com/changesets/changesets/commit/90f3b651f9c0403920b17801b84a2fbe6f190e2a) [#373](https://github.com/changesets/changesets/pull/373) Thanks [@Blasz](https://github.com/Blasz)! - Fix patch bumped dependencies not being updated in dependents package.json when leaving semver range with `updateInternalDependencies` set to minor.

- Updated dependencies [[`90f3b65`](https://github.com/changesets/changesets/commit/90f3b651f9c0403920b17801b84a2fbe6f190e2a)]:
  - @changesets/apply-release-plan@3.0.3

## 2.7.1

### Patch Changes

- [`52a88ce`](https://github.com/changesets/changesets/commit/52a88ce816692f6b18fa8f3f67d707b78b0b8210) [#361](https://github.com/changesets/changesets/pull/361) Thanks [@Blasz](https://github.com/Blasz)! - Fix dependency release lines being output when they were skipped via the updateInternalDependencies config option

- Updated dependencies [[`52a88ce`](https://github.com/changesets/changesets/commit/52a88ce816692f6b18fa8f3f67d707b78b0b8210)]:
  - @changesets/apply-release-plan@3.0.1

## 2.7.0

### Minor Changes

- [`2b49d66`](https://github.com/changesets/changesets/commit/2b49d668ecaa1333bc5c7c5be4648dda1b11528d) [#358](https://github.com/changesets/changesets/pull/358) Thanks [@Blasz](https://github.com/Blasz)! - Add new config option 'updateInternalDependencies' that can be set to 'minor' to only update internal dependencies in the same release if the dependency was minor released or above. Defaults to 'patch' which is the existing behaviour.

### Patch Changes

- Updated dependencies [[`89f0c49`](https://github.com/changesets/changesets/commit/89f0c497ac21b8d008da67caff8032947836c7b1), [`2b49d66`](https://github.com/changesets/changesets/commit/2b49d668ecaa1333bc5c7c5be4648dda1b11528d), [`09f62f9`](https://github.com/changesets/changesets/commit/09f62f9c822f31899a48cbd93c7801d72a80b97e)]:
  - @changesets/git@1.0.5
  - @changesets/apply-release-plan@3.0.0
  - @changesets/types@3.0.0
  - @changesets/config@1.1.0
  - @changesets/assemble-release-plan@2.0.4
  - @changesets/get-release-plan@1.0.4
  - @changesets/pre@1.0.4
  - @changesets/read@0.4.6
  - @changesets/write@0.1.3

## 2.6.5

### Patch Changes

- [`d570a24`](https://github.com/changesets/changesets/commit/d570a24740a374a9547dd7d931e6ac854e36a9fb) [#328](https://github.com/changesets/changesets/pull/328) Thanks [@zkochan](https://github.com/zkochan)! - Use pnpm inside a pnpm workspace. Previously, pnpm was detected properly only in projects that use one lockfile per project. However, by default pnpm creates a single lockfile per workspace.

- Updated dependencies [[`d678da5`](https://github.com/changesets/changesets/commit/d678da5e9936862bb66e5edb538c5b8be23d4ffe)]:
  - @changesets/assemble-release-plan@2.0.2

## 2.6.4

### Patch Changes

- Updated dependencies [[`1706fb7`](https://github.com/changesets/changesets/commit/1706fb751ecc2f5a792c42f467b2063078d58716)]:
  - @changesets/apply-release-plan@2.0.1
  - @changesets/assemble-release-plan@2.0.1
  - @changesets/config@1.0.3
  - @changesets/errors@0.1.4
  - @changesets/get-release-plan@1.0.3
  - @changesets/git@1.0.3
  - @changesets/logger@0.0.5
  - @changesets/pre@1.0.3
  - @changesets/read@0.4.5
  - @changesets/types@2.0.1
  - @changesets/write@0.1.2

## 2.6.3

### Patch Changes

- [`9cdfa36`](https://github.com/changesets/changesets/commit/9cdfa36f831cca2b11593881671410a6d2f0b546) [#318](https://github.com/changesets/changesets/pull/318) Thanks [@Noviny](https://github.com/Noviny)! - Typo fix in prerelease warning message

- Updated dependencies [[`44555b4`](https://github.com/changesets/changesets/commit/44555b44cac843d973d31adbfc7703f45117d204), [`c3cc232`](https://github.com/changesets/changesets/commit/c3cc23204c6cb80487aced1b37ebe8ffde0e2111), [`011d57f`](https://github.com/changesets/changesets/commit/011d57f1edf9e37f75a8bef4f918e72166af096e), [`011d57f`](https://github.com/changesets/changesets/commit/011d57f1edf9e37f75a8bef4f918e72166af096e), [`011d57f`](https://github.com/changesets/changesets/commit/011d57f1edf9e37f75a8bef4f918e72166af096e), [`011d57f`](https://github.com/changesets/changesets/commit/011d57f1edf9e37f75a8bef4f918e72166af096e)]:
  - @changesets/apply-release-plan@2.0.0
  - @changesets/assemble-release-plan@2.0.0
  - @changesets/types@2.0.0
  - @changesets/get-release-plan@1.0.2
  - @changesets/config@1.0.2
  - @changesets/git@1.0.2
  - @changesets/pre@1.0.2
  - @changesets/read@0.4.4
  - @changesets/write@0.1.1

## 2.6.2

### Patch Changes

- [`04ddfd7`](https://github.com/changesets/changesets/commit/04ddfd7c3acbfb84ef9c92873fe7f9dea1f5145c) [#305](https://github.com/changesets/changesets/pull/305) Thanks [@Noviny](https://github.com/Noviny)! - Add link to changelog in readme

- [`b49e1cf`](https://github.com/changesets/changesets/commit/b49e1cff65dca7fe9e341a35aa91704aa0e51cb3) [#306](https://github.com/changesets/changesets/pull/306) Thanks [@Andarist](https://github.com/Andarist)! - Ignore `node_modules` when glob searching for packages. This fixes an issue with package cycles.

- Updated dependencies [[`04ddfd7`](https://github.com/changesets/changesets/commit/04ddfd7c3acbfb84ef9c92873fe7f9dea1f5145c), [`e56928b`](https://github.com/changesets/changesets/commit/e56928bbd6f9096def06ac37487bdbf28efec9d1), [`b49e1cf`](https://github.com/changesets/changesets/commit/b49e1cff65dca7fe9e341a35aa91704aa0e51cb3)]:
  - @changesets/apply-release-plan@1.0.1
  - @changesets/assemble-release-plan@1.0.1
  - @changesets/config@1.0.1
  - @changesets/errors@0.1.3
  - @changesets/get-release-plan@1.0.1
  - @changesets/git@1.0.1
  - @changesets/logger@0.0.4
  - @changesets/parse@0.3.3
  - @changesets/pre@1.0.1
  - @changesets/read@0.4.3
  - @changesets/test-utils@0.0.4
  - @changesets/types@1.0.1

## 2.6.1

### Patch Changes

- [`41e2e3d`](https://github.com/changesets/changesets/commit/41e2e3dd1053ff2f35a1a07e60793c9099f26997) [#292](https://github.com/changesets/changesets/pull/292) Thanks [@acheronfail](https://github.com/acheronfail)! - Use `@changesets/write` for writing changesets internally

- [`cc8c921`](https://github.com/changesets/changesets/commit/cc8c92143d4c4b7cca8b9917dfc830a40b5cda20) [#290](https://github.com/changesets/changesets/pull/290) Thanks [@mitchellhamilton](https://github.com/mitchellhamilton)! - Use `@manypkg/get-packages` instead of `get-workspaces` internally

- [`cc8c921`](https://github.com/changesets/changesets/commit/cc8c92143d4c4b7cca8b9917dfc830a40b5cda20) [#290](https://github.com/changesets/changesets/pull/290) Thanks [@mitchellhamilton](https://github.com/mitchellhamilton)! - Don't show `all packages` in list of selected packages in major and minor questions in `add` command after the question is answered

- Updated dependencies [[`41e2e3d`](https://github.com/changesets/changesets/commit/41e2e3dd1053ff2f35a1a07e60793c9099f26997), [`cc8c921`](https://github.com/changesets/changesets/commit/cc8c92143d4c4b7cca8b9917dfc830a40b5cda20), [`cc8c921`](https://github.com/changesets/changesets/commit/cc8c92143d4c4b7cca8b9917dfc830a40b5cda20), [`cc8c921`](https://github.com/changesets/changesets/commit/cc8c92143d4c4b7cca8b9917dfc830a40b5cda20), [`cc8c921`](https://github.com/changesets/changesets/commit/cc8c92143d4c4b7cca8b9917dfc830a40b5cda20), [`cc8c921`](https://github.com/changesets/changesets/commit/cc8c92143d4c4b7cca8b9917dfc830a40b5cda20), [`2363366`](https://github.com/changesets/changesets/commit/2363366756d1b15bddf6d803911baccfca03cbdf), [`41e2e3d`](https://github.com/changesets/changesets/commit/41e2e3dd1053ff2f35a1a07e60793c9099f26997), [`41e2e3d`](https://github.com/changesets/changesets/commit/41e2e3dd1053ff2f35a1a07e60793c9099f26997), [`cc8c921`](https://github.com/changesets/changesets/commit/cc8c92143d4c4b7cca8b9917dfc830a40b5cda20), [`cc8c921`](https://github.com/changesets/changesets/commit/cc8c92143d4c4b7cca8b9917dfc830a40b5cda20)]:
  - @changesets/types@1.0.0
  - @changesets/git@1.0.0
  - @changesets/pre@1.0.0
  - @changesets/get-release-plan@1.0.0
  - @changesets/apply-release-plan@1.0.0
  - @changesets/parse@0.3.2
  - @changesets/write@0.1.0
  - @changesets/config@1.0.0
  - @changesets/assemble-release-plan@1.0.0
  - @changesets/read@0.4.2

## 2.6.0

### Minor Changes

- [`ca934d7`](https://github.com/changesets/changesets/commit/ca934d7b9dcd3203f27a4a2cefb19e9cb90cb083) [#282](https://github.com/changesets/changesets/pull/282) Thanks [@tarang9211](https://github.com/tarang9211)! - Add all packages option to major and minor selects

### Patch Changes

- [`2adfe66`](https://github.com/changesets/changesets/commit/2adfe66252f9b8b7a6a0c261f608dcb3c9294bfb) [#288](https://github.com/changesets/changesets/pull/288) Thanks [@mitchellhamilton](https://github.com/mitchellhamilton)! - Stop running `npm profile get` when using non-npm registries

- Updated dependencies []:
  - @changesets/apply-release-plan@0.4.2

## 2.5.2

### Patch Changes

- [`184a653`](https://github.com/changesets/changesets/commit/184a653de2d050f877b91d0ad319f00683bbc7ff) [#278](https://github.com/changesets/changesets/pull/278) Thanks [@mitchellhamilton](https://github.com/mitchellhamilton)! - Use a single prompt for the semver version type when there is only a single package in the repo in `changeset add`

  ![changeset add command with single package repo](https://user-images.githubusercontent.com/11481355/75123292-40f78f00-56fa-11ea-9e16-fe3f5e2d9cf5.gif)

## 2.5.1

### Patch Changes

- [`1282ef6`](https://github.com/changesets/changesets/commit/1282ef698761c1f634fb409842cc7de6b4d03da4) [#263](https://github.com/changesets/changesets/pull/263) Thanks [@mitchellhamilton](https://github.com/mitchellhamilton)! - Fixed a bug where only the unreleased pre-release changesets were taken into account when calculating the new version, not previously released changesets.

- Updated dependencies [[`1282ef6`](https://github.com/changesets/changesets/commit/1282ef698761c1f634fb409842cc7de6b4d03da4)]:
  - @changesets/assemble-release-plan@0.3.1
  - @changesets/apply-release-plan@0.4.1

## 2.5.0

### Minor Changes

- [`fe0d9192`](https://github.com/changesets/changesets/commit/fe0d9192544646e1a755202b87dfe850c1c200a3) [#236](https://github.com/changesets/changesets/pull/236) Thanks [@Andarist](https://github.com/Andarist)! - When in pnpm-managed project use pnpm for publishing.

- [`fe0d9192`](https://github.com/changesets/changesets/commit/fe0d9192544646e1a755202b87dfe850c1c200a3) [#236](https://github.com/changesets/changesets/pull/236) Thanks [@Andarist](https://github.com/Andarist)! - Read also pnpm workspace packages when searching for packages.

### Patch Changes

- [`cc64ad52`](https://github.com/changesets/changesets/commit/cc64ad52ef334ba77efb61ed8cd4b2f4abd2a668) [#254](https://github.com/changesets/changesets/pull/254) Thanks [@Andarist](https://github.com/Andarist)! - Added GitHub Actions support to CI detection.

- [`4af2a78b`](https://github.com/changesets/changesets/commit/4af2a78b22a2d22b557fe21603c83cc99959773d) [#232](https://github.com/changesets/changesets/pull/232) Thanks [@harrysolovay](https://github.com/harrysolovay)! - Change format of the automatic commit messages to be in line with conventional commits.

- [`ef6402c9`](https://github.com/changesets/changesets/commit/ef6402c9d8dc1832126732dbbafb015b71f57f83) [#252](https://github.com/changesets/changesets/pull/252) Thanks [@Andarist](https://github.com/Andarist)! - Avoid trailing newline for single-line changesets to avoid double newline between release lines when generating final markdown for changelog.

- Updated dependencies [[`fe0d9192`](https://github.com/changesets/changesets/commit/fe0d9192544646e1a755202b87dfe850c1c200a3), [`ef6402c9`](https://github.com/changesets/changesets/commit/ef6402c9d8dc1832126732dbbafb015b71f57f83), [`fe0d9192`](https://github.com/changesets/changesets/commit/fe0d9192544646e1a755202b87dfe850c1c200a3), [`503154db`](https://github.com/changesets/changesets/commit/503154db39fe8ab88a1176e4569c48078bcf5569)]:
  - get-workspaces@0.6.0
  - @changesets/apply-release-plan@0.4.0
  - get-dependents-graph@0.2.0
  - @changesets/get-release-plan@0.4.0
  - @changesets/git@0.4.0
  - @changesets/pre@0.2.0
  - @changesets/read@0.4.1

## 2.4.1

### Patch Changes

- [`6c0b53d`](https://github.com/changesets/changesets/commit/6c0b53da63f287dfa9af45532f1f1d628b518b25) [#227](https://github.com/changesets/changesets/pull/227) - Fix received typo

## 2.4.0

### Minor Changes

- [`bca8865`](https://github.com/changesets/changesets/commit/bca88652d38caa31e789c4564230ba0b49562ad2) [#221](https://github.com/changesets/changesets/pull/221) Thanks [@mitchellhamilton](https://github.com/mitchellhamilton)! - Added support for `baseBranch` option which specifies what branch Changesets should use when determining what packages have changed

- [`bca8865`](https://github.com/changesets/changesets/commit/bca88652d38caa31e789c4564230ba0b49562ad2) [#221](https://github.com/changesets/changesets/pull/221) Thanks [@mitchellhamilton](https://github.com/mitchellhamilton)! - Added support for `--since` option to the `status` command which shows the release plan since the git ref(branch, tag, commit, etc.) specified with `--since` and deprecate `--sinceMaster` option

### Patch Changes

- [`bca8865`](https://github.com/changesets/changesets/commit/bca88652d38caa31e789c4564230ba0b49562ad2) [#221](https://github.com/changesets/changesets/pull/221) Thanks [@mitchellhamilton](https://github.com/mitchellhamilton)! - Moved error advising users to run changeset init when a .changeset directory from the add command to all commands except init

- [`bca8865`](https://github.com/changesets/changesets/commit/bca88652d38caa31e789c4564230ba0b49562ad2) [#221](https://github.com/changesets/changesets/pull/221) Thanks [@mitchellhamilton](https://github.com/mitchellhamilton)! - Fixed old changesets not being read in status command
- Updated dependencies [[`bca8865`](https://github.com/changesets/changesets/commit/bca88652d38caa31e789c4564230ba0b49562ad2), [`bca8865`](https://github.com/changesets/changesets/commit/bca88652d38caa31e789c4564230ba0b49562ad2), [`bca8865`](https://github.com/changesets/changesets/commit/bca88652d38caa31e789c4564230ba0b49562ad2), [`bca8865`](https://github.com/changesets/changesets/commit/bca88652d38caa31e789c4564230ba0b49562ad2)]:
  - @changesets/get-release-plan@0.3.0
  - @changesets/read@0.4.0
  - @changesets/config@0.3.0
  - @changesets/git@0.3.0
  - @changesets/apply-release-plan@0.3.1

## 2.3.3

### Patch Changes

- [`9cd1eaf`](https://github.com/changesets/changesets/commit/9cd1eafc1620894a39fe10d3e393ad8f812df53a) [#214](https://github.com/changesets/changesets/pull/214) Thanks [@Noviny](https://github.com/Noviny)! - Remove unused dependencies
- Updated dependencies [[`9cd1eaf`](https://github.com/changesets/changesets/commit/9cd1eafc1620894a39fe10d3e393ad8f812df53a), [`b17ed74`](https://github.com/changesets/changesets/commit/b17ed7411ea57e38b20e646321d5053b213d198a)]:
  - @changesets/logger@0.0.3
  - @changesets/pre@0.1.1
  - @changesets/test-utils@0.0.3
  - @changesets/git@0.2.5
  - @changesets/config@0.2.4

## 2.3.2

### Patch Changes

- [`7c1269de`](https://github.com/changesets/changesets/commit/7c1269de31f02c731fdb69d7be037b83e12a0445) Thanks [@Noviny](https://github.com/Noviny)! - Fix previous version not having correctly built dists

## 2.3.1

### Patch Changes

- [`a0b5dba`](https://github.com/changesets/changesets/commit/a0b5dba3fe59d2b2e856173e40b936e56ab74ac6) [#209](https://github.com/changesets/changesets/pull/209) Thanks [@ryanbraganza](https://github.com/ryanbraganza)! - Skip OTP check during isCI

## 2.3.0

### Minor Changes

- [`8f0a1ef`](https://github.com/changesets/changesets/commit/8f0a1ef327563512f471677ef0ca99d30da009c0) [#183](https://github.com/changesets/changesets/pull/183) Thanks [@mitchellhamilton](https://github.com/mitchellhamilton)! - Add support for prereleases. Prereleases work with two new commands, `pre enter` and `pre exit` along with changes to `version` and `exit`. For more information, see [the docs on prereleases](https://github.com/changesets/changesets/blob/main/docs/prereleases.md).

### Patch Changes

- [`8f0a1ef`](https://github.com/changesets/changesets/commit/8f0a1ef327563512f471677ef0ca99d30da009c0) [#183](https://github.com/changesets/changesets/pull/183) Thanks [@mitchellhamilton](https://github.com/mitchellhamilton)! - Add `InternalError` for errors which are unexpected and if they occur, an issue should be opened. The CLI catches the error and logs a link for users to open an issue with the error and versions of Node and Changesets filled in

- [`8f0a1ef`](https://github.com/changesets/changesets/commit/8f0a1ef327563512f471677ef0ca99d30da009c0) [#183](https://github.com/changesets/changesets/pull/183) Thanks [@mitchellhamilton](https://github.com/mitchellhamilton)! - Always publish packages if they don't exist on npm rather than only if they are a greater version than the latest version on npm
- Updated dependencies [[`8f0a1ef`](https://github.com/changesets/changesets/commit/8f0a1ef327563512f471677ef0ca99d30da009c0), [`8f0a1ef`](https://github.com/changesets/changesets/commit/8f0a1ef327563512f471677ef0ca99d30da009c0), [`8f0a1ef`](https://github.com/changesets/changesets/commit/8f0a1ef327563512f471677ef0ca99d30da009c0), [`8f0a1ef`](https://github.com/changesets/changesets/commit/8f0a1ef327563512f471677ef0ca99d30da009c0), [`8f0a1ef`](https://github.com/changesets/changesets/commit/8f0a1ef327563512f471677ef0ca99d30da009c0)]:
  - @changesets/assemble-release-plan@0.3.0
  - @changesets/apply-release-plan@0.3.0
  - @changesets/get-release-plan@0.2.0
  - @changesets/types@0.4.0
  - @changesets/errors@0.1.2
  - @changesets/pre@0.1.0
  - @changesets/config@0.2.3
  - get-dependents-graph@0.1.2
  - get-workspaces@0.5.2
  - @changesets/git@0.2.4
  - @changesets/logger@0.0.2
  - @changesets/parse@0.3.1
  - @changesets/read@0.3.1
  - @changesets/test-utils@0.0.2

## 2.2.0

### Minor Changes

- [`a679b1d`](https://github.com/changesets/changesets/commit/a679b1dcdcb56652d31536e2d6326ba02a9dfe62) [#204](https://github.com/changesets/changesets/pull/204) Thanks [@Andarist](https://github.com/Andarist)! - Respect `publishConfig.access` in workspace package.jsons

  Previously, every package in your repository had one 'public' or 'restricted' setting.

  Now, if a workspace has `publishConfig.access` in its package.json, we will prioritize it over the global changesets config.

- [`51a0d76`](https://github.com/changesets/changesets/commit/51a0d766c7064b4c6a9d1490593522c6fcd02929) [#182](https://github.com/changesets/changesets/pull/182) Thanks [@ajaymathur](https://github.com/ajaymathur)! - Updated the package to use the new `@changesets/logger` for logging.

### Patch Changes

- [`5ababa0`](https://github.com/changesets/changesets/commit/5ababa08c8ea5ee3b4ff92253e2e752a5976cd27) [#201](https://github.com/changesets/changesets/pull/201) Thanks [@ajaymathur](https://github.com/ajaymathur)! - Updated to use the Error classes from the @changesets/errors package

- [`a679b1d`](https://github.com/changesets/changesets/commit/a679b1dcdcb56652d31536e2d6326ba02a9dfe62) [#204](https://github.com/changesets/changesets/pull/204) Thanks [@Andarist](https://github.com/Andarist)! - Correctly handle the 'access' flag for packages

  Previously, we had access as "public" or "private", access "private" isn't valid. This was a confusing because there are three states for publishing a package:

  - `private: true` - the package will not be published to npm (worked)
  - `access: public` - the package will be publicly published to npm (even if it uses a scope) (worked)
  - `access: restricted` - the package will be published to npm, but only visible/accessible by those who are part of the scope. This technically worked, but we were passing the wrong bit of information in.

  Now, we pass the correct access options `public` or `restricted`.

- [`da11ab8`](https://github.com/changesets/changesets/commit/da11ab8a4e4324a7023d12f990beec8c3b6ae35f) [#205](https://github.com/changesets/changesets/pull/205) Thanks [@mitchellhamilton](https://github.com/mitchellhamilton)! - Don't update ranges set to \*/x/X when versioning

- Updated dependencies [[`51a0d76`](https://github.com/changesets/changesets/commit/51a0d766c7064b4c6a9d1490593522c6fcd02929), [`5ababa0`](https://github.com/changesets/changesets/commit/5ababa08c8ea5ee3b4ff92253e2e752a5976cd27), [`a679b1d`](https://github.com/changesets/changesets/commit/a679b1dcdcb56652d31536e2d6326ba02a9dfe62), [`5ababa0`](https://github.com/changesets/changesets/commit/5ababa08c8ea5ee3b4ff92253e2e752a5976cd27), [`da11ab8`](https://github.com/changesets/changesets/commit/da11ab8a4e4324a7023d12f990beec8c3b6ae35f)]:
  - @changesets/logger@0.0.1
  - @changesets/test-utils@0.0.1
  - @changesets/config@0.2.2
  - @changesets/apply-release-plan@0.2.3
  - get-workspaces@0.5.1
  - @changesets/types@0.3.1
  - @changesets/errors@0.1.1

## 2.1.2

### Patch Changes

- Remove console log
- When 2fa token is wrong (ie, it has expired) reprompt instead of failing

## 2.1.1

### Patch Changes

- [`71a0193`](https://github.com/changesets/changesets/commit/71a0193939b13f693d3652c01a82a67a6be5e104) [#197](https://github.com/changesets/changesets/pull/197) Thanks [@Noviny](https://github.com/Noviny)! - Close off error when running publish where individual packages have pre or post hooks.

  Under the previous behaviour, JSON parsing the response to publish failed, causing git tags to not be created.

## 2.1.0

### Minor Changes

- [`8dce96f`](https://github.com/changesets/changesets/commit/8dce96f8aec43f82b35e65f54b06cbeed3275885) [#187](https://github.com/changesets/changesets/pull/187) Thanks [@gardnerjack](https://github.com/gardnerjack)! - Added --empty flag to the add command for empty changeset files. New tests for adding, writing, parsing, and reading empty changesets.

### Patch Changes

- [`7e2fc8e`](https://github.com/changesets/changesets/commit/7e2fc8ee58be3be3452358cc7852412fbec0f995) [#184](https://github.com/changesets/changesets/pull/184) Thanks [@Noviny](https://github.com/Noviny)! - Fix message on warning if 'add' command is run before changesets has been initialised.

- Updated dependencies [[`8dce96f`](https://github.com/changesets/changesets/commit/8dce96f8aec43f82b35e65f54b06cbeed3275885)]:
  - @changesets/parse@0.3.0
  - @changesets/read@0.3.0
  - @changesets/get-release-plan@0.1.3

## 2.0.4

### Patch Changes

- [`f63b652`](https://github.com/changesets/changesets/commit/f63b6521d2b20c61526c7e31ddf18c4b480b456f) [#176](https://github.com/changesets/changesets/pull/176) Thanks [@mitchellhamilton](https://github.com/mitchellhamilton)! - Change the log type of the default config writing message from `error` to `info` because the message isn't an error

- [`df35f32`](https://github.com/changesets/changesets/commit/df35f32f3844d34ed2bb2ee4a41495a88fd191a9) [#179](https://github.com/changesets/changesets/pull/179) Thanks [@ryanbraganza](https://github.com/ryanbraganza)! - Remove dependency on uuid

- [`94de7c1`](https://github.com/changesets/changesets/commit/94de7c1df278d63f98b599c08271ba4ef26bc3f8) [#173](https://github.com/changesets/changesets/pull/173) Thanks [@ajaymathur](https://github.com/ajaymathur)! - Catch errors from git being absent and continue on as best possible

- [`72babcb`](https://github.com/changesets/changesets/commit/72babcbccbdd41618d9cb90b2a8871fe63643601) [#178](https://github.com/changesets/changesets/pull/178) Thanks [@mitchellhamilton](https://github.com/mitchellhamilton)! - Fix changelog generator options not being provided

- Updated dependencies [[`72babcb`](https://github.com/changesets/changesets/commit/72babcbccbdd41618d9cb90b2a8871fe63643601)]:
  - @changesets/apply-release-plan@0.2.2
  - @changesets/git@0.2.3

## 2.0.3

### Patch Changes

- [89c0894](https://github.com/changesets/changesets/commit/89c08944fac84f71241305e359e9717ad4ec1b62) [#167](https://github.com/changesets/changesets/pull/167) Thanks [@Noviny](https://github.com/Noviny)! - Fix broken `--since-master` flag (which was broken by the move to v2 changesets)

- Updated dependencies [89c0894]:
  - @changesets/git@0.2.2
  - @changesets/get-release-plan@0.1.2
  - @changesets/read@0.2.2

## 2.0.2

### Patch Changes

- [1ff73b7](https://github.com/changesets/changesets/commit/1ff73b74f414031e49c6fd5a0f68e9974900d381) [#156](https://github.com/changesets/changesets/pull/156) Thanks [@mitchellhamilton](https://github.com/mitchellhamilton)! - Fix commits not being obtained for old changesets

- [0320391](https://github.com/changesets/changesets/commit/0320391699a73621d0e51ce031062a06cbdefadc) [#163](https://github.com/changesets/changesets/pull/163) Thanks [@Noviny](https://github.com/Noviny)! - Reordered dependencies in the package json (this should have no impact)

- Updated dependencies [3dd003c, 1ff73b7, 8c43fa0, 0320391, 1ff73b7]:
  - @changesets/get-release-plan@0.1.1
  - @changesets/apply-release-plan@0.2.1
  - @changesets/assemble-release-plan@0.2.1
  - get-dependents-graph@0.1.1
  - @changesets/git@0.2.1
  - @changesets/parse@0.2.1
  - @changesets/read@0.2.1
  - @changesets/types@0.3.0
  - @changesets/config@0.2.1

## 2.0.1

### Patch Changes

- [62873042](https://github.com/changesets/changesets/commit/62873042) [#153](https://github.com/changesets/changesets/pull/153) Thanks [@mitchellhamilton](https://github.com/mitchellhamilton)! - Make init write the default config file if it doesn't exist with a special message if an old config file exists

- [85f837a7](https://github.com/changesets/changesets/commit/85f837a7) [#150](https://github.com/changesets/changesets/pull/150) Thanks [@mitchellhamilton](https://github.com/mitchellhamilton)! - Fix init command from crashing because it was trying to access a config that doesn't exist

- [709493b4](https://github.com/changesets/changesets/commit/709493b4) - Fix version always removing legacy changesets even when the commit option is false

- [16cb2ff3](https://github.com/changesets/changesets/commit/16cb2ff3) [#151](https://github.com/changesets/changesets/pull/151) Thanks [@mitchellhamilton](https://github.com/mitchellhamilton)! - Include changelog directory in published files

## 2.0.0

Welcome to version 2 🎉🦋

Quickest summary of the most exciting changes:

🦋 Changesets (the written files) have a new format! They are now human readable/writeable

🦋 The config options have been completely rethought to be clearer and more concise

🦋 Changesets has been significantly decomposed, allowing an easier time building tools on top of it

### Major Changes

- [ca8ff585](https://github.com/changesets/changesets/commit/ca8ff585) [#147](https://github.com/changesets/changesets/pull/147) Thanks [@Noviny](https://github.com/Noviny)!

#### Changed command line argument names

We have removed command line arguments that overrwrite the config. The following commands can no longer
be passed in:

- `updateChangelog`
- `isPublic`
- `skipCI`
- `commit`

This has been done to avoid overloading the number of ways you can pass options, as within any single
repository, there should be a single consistent way in which these values are always provided.

- [ca8ff585](https://github.com/changesets/changesets/commit/ca8ff585) [#147](https://github.com/changesets/changesets/pull/147) Thanks [@Noviny](https://github.com/Noviny)!

#### Changed how Config works

The Changesets config is now written in JSON with fewer options. The new defaults are shown below.

```json
{
  "$schema": "https://unpkg.com/@changesets/config/schema.json",
  "changelog": "@changesets/cli/changelog",
  "commit": false,
  "linked": [],
  "access": "private"
}
```

**Reasoning**: Having a JSON config makes it easier to build other tools on changesets because the config can be read without executing user code that could potentially be unsafe. It also means we can have easy autocompletion and descriptions in editors that don't go out of date like the comments in the JS config along with being able to packagise changelog entry generators.

##### Migrating

1. Run `yarn changeset init` to create a config file in the new format at `.changeset/config.json`
1. If you're using changelogs, move `getReleaseLine` and `getDependencyReleaseLine` to their own module and set the changelog option to the path to the module. If you're not using changelogs, set the changelog option to `false`. In the future, we will be providing packages to write changelogs for common use cases
1. Set `access` to `"public"` if `publishOptions.public` is `true`, otherwise set it to `"private"`
1. If you use `linked`, copy your linked package groups from the JS config to the the JSON file
1. If you use `commit` and `skipCI` in `versionOptions` or `publishOptions`, set commit to `true`, all commits will include a skip ci message. if you have a use case for only using commit on one command or not including a skip ci message by default, contact us and we will talk about re-implementing these features.
1. Delete `.changeset/config.js`

- [ca8ff585](https://github.com/changesets/changesets/commit/ca8ff585) [#147](https://github.com/changesets/changesets/pull/147) Thanks [@Noviny](https://github.com/Noviny)!

#### Changelog generation functions have minor changes

In addition to how these functions are defined (see changes to config), the data that is passed through
to these functions is notably different to what it was before. For the most part, the changelog functions
simply receive richer information, based on the new changelog format.

**BREAKING**: The release objects and dependency release objects now use `release.newVersion` for the latest
version, instead of the previous `release.version`.

The `@changesets/types` package includes exports for both `GetReleaseLine` as well as `GetDependencyReleaseLine`.

If you were using the default changelog generation scripts, you won't need to worry. Otherwise, we recommend updating
your command and manually running `version` to ensure you are still getting the changelogs you expect.

**Looking further forward** We are already aware that we want to change how people write these generation functions,
including opening up more flexibility, and access to things such as the underlying release plan. This will likely require
a breaking change in the future, but we thought we were changing enough this release that we didn't want too much turmoil. 😁

- [ca8ff585](https://github.com/changesets/changesets/commit/ca8ff585) [#147](https://github.com/changesets/changesets/pull/147) Thanks [@Noviny](https://github.com/Noviny)!

#### Renamed commands

- `bump` has been renamed to `version`
- `release` has been renamed to `publish`

This is a reversion to the changes made in `1.0.0`.

**Reasoning**: We switched the names because we wanted to avoid confusion with the related
tasks in npm. While technically it removed confusion that this was doing the same thing as
`npm version`, or `npm publish`, the new terms did not convey easily grokkable meanings. As
we weren't benefiting from the new names, we have decided to revert to names that have more
meaning within the community, even though these commands do slightly more than this.

### Minor Changes

- [296a6731](https://github.com/changesets/changesets/commit/296a6731) - Safety bump: Towards the end of preparing changesets v2, there was a lot of chaos - this bump is to ensure every package on npm matches what is found in the repository.

### Patch Changes

- Updated dependencies [ca8ff585, 296a6731]:
  - @changesets/get-release-plan@0.1.0
  - @changesets/apply-release-plan@0.2.0
  - @changesets/assemble-release-plan@0.2.0
  - @changesets/config@0.2.0
  - get-dependents-graph@0.1.0
  - get-workspaces@0.5.0
  - @changesets/git@0.2.0
  - @changesets/parse@0.2.0
  - @changesets/read@0.2.0
  - @changesets/types@0.2.0

## 1.3.3

### Patch Changes

- [a15abbf9](https://github.com/changesets/changesets/commit/a15abbf9) - Previous release shipped unbuilt code - fixing that

## 1.3.1

### Patch Changes

- [c46e9ee7](https://github.com/changesets/changesets/commit/c46e9ee7) - Use 'spawndamnit' package for all new process spawning
- [5b28c527](https://github.com/changesets/changesets/commit/5b28c527) - Fix 2FA check on release
- [6f8eb05a](https://github.com/changesets/changesets/commit/6f8eb05a) - Updated readme
- [6d119893](https://github.com/changesets/changesets/commit/6d119893) - Move `git` module to be its own external module

## 1.3.0

### Minor Changes

- [e55fa3f0](https://github.com/changesets/changesets/commit/e55fa3f0) [#92](https://github.com/changesets/changesets/pull/92) Thanks [@highvoltag3](https://github.com/highvoltag3)! - Catch Promise rejection on SIGINT and exit gracefully
- [94267ff3](https://github.com/changesets/changesets/commit/94267ff3) [#106](https://github.com/changesets/changesets/pull/106) Thanks [@mitchellhamilton](https://github.com/mitchellhamilton)! - Improve 2FA support for publishing:

  - Prompt for an OTP code when required
  - Add `--otp` option to release command

### Patch Changes

- [a700de81](https://github.com/changesets/changesets/commit/a700de81) [#104](https://github.com/changesets/changesets/pull/104) Thanks [@Noviny](https://github.com/Noviny)! - Fix auto-generated documentation to point outwards to changesets repo to stop it going stale
- [94267ff3](https://github.com/changesets/changesets/commit/94267ff3) [#106](https://github.com/changesets/changesets/pull/106) Thanks [@mitchellhamilton](https://github.com/mitchellhamilton)! - Inline last usages of bolt
- [d4bbab4e](https://github.com/changesets/changesets/commit/d4bbab4e) [#91](https://github.com/changesets/changesets/pull/91) Thanks [@mitchellhamilton](https://github.com/mitchellhamilton)! - Convert some internals to TypeScript
- [fc32bc11](https://github.com/changesets/changesets/commit/fc32bc11) [#94](https://github.com/changesets/changesets/pull/94) Thanks [@Noviny](https://github.com/Noviny)! - Better Docs in readme

- Updated dependencies [cbb2c953]:
  - get-workspaces@0.4.0

## 1.2.0

### Minor Changes

- [16fde2e0](https://github.com/changesets/changesets/commit/16fde2e0) [#75](https://github.com/changesets/changesets/pull/75) Thanks [@mitchellhamilton](https://github.com/mitchellhamilton)! - Use [enquirer](https://github.com/enquirer/enquirer) instead of inquirer for asking questions because it's smaller, faster and prettier.
  Change bump type questions from asking for each bump type individually per package to asking users to two questions where the user selects what packages should have major and minor bumps and the packages left are assumed to be patch bumps. This dramatically cuts down the amount of time it takes to create a changeset with a large number of packages.

  ![example of using the CLI with the new questions](https://user-images.githubusercontent.com/11481355/58873398-a1c4de80-8709-11e9-80e8-16061e395b15.gif)

### Patch Changes

- [20da7747](https://github.com/changesets/changesets/commit/20da7747) [#66](https://github.com/changesets/changesets/pull/66) Thanks [@Noviny](https://github.com/Noviny)! - Update package.json field so each links into its own package
- [29ff34ed](https://github.com/changesets/changesets/commit/29ff34ed) [#82](https://github.com/changesets/changesets/pull/82) Thanks [@mitchellhamilton](https://github.com/mitchellhamilton)! - Limit the number of rows the package selection question takes up so that the question is still visible in repos with a very large number of packages

  ![changeset package question in atlaskit](https://user-images.githubusercontent.com/11481355/59012109-ff783880-8879-11e9-9b68-77ab672921fa.png)

- [ef9be2df](https://github.com/changesets/changesets/commit/ef9be2df) [#81](https://github.com/changesets/changesets/pull/81) Thanks [@mitchellhamilton](https://github.com/mitchellhamilton)! - Fix tables in status command from flowing over to the next line

  ![changeset status --verbose output](https://user-images.githubusercontent.com/11481355/59011589-875d4300-8878-11e9-9e69-cada41f83261.png)

- [91000292](https://github.com/changesets/changesets/commit/91000292) [#78](https://github.com/changesets/changesets/pull/78) Thanks [@mitchellhamilton](https://github.com/mitchellhamilton)! - Fix misaligned CLI messages

## 1.1.5

### Patch Changes

- [7fa42641](https://github.com/changesets/changesets/commit/7fa42641) [#61](https://github.com/changesets/changesets/pull/61) Thanks [@Noviny](https://github.com/Noviny)! - When bumping, run prettier over the changelog file.

  If you want this option turned off, add `disabledLanguage: ["markdown"] to your prettier config.

  - [6dc510f4](https://github.com/changesets/changesets/commit/6dc510f4) [#62](https://github.com/changesets/changesets/pull/62) Thanks [@mitchellhamilton](https://github.com/mitchellhamilton)! - Add butterfly emoji prefix to CLI output

## 1.1.4

### Patch Changes

- [83ba6d3f](https://github.com/Noviny/changesets/commit/83ba6d3f) - Convert various modules to TypeScript
- [a966701d](https://github.com/Noviny/changesets/commit/a966701d) - Add repository information to package.json
- [c00e65ef](https://github.com/Noviny/changesets/commit/c00e65ef) - Fix bug where unprovided command line options overrode the config file, leading to incorrect states
- [8d2e700c](https://github.com/Noviny/changesets/commit/8d2e700c) - Remove unused function parseChangesetCommit
- [7399648d](https://github.com/Noviny/changesets/commit/7399648d) - Make ids human readable

- Updated dependencies [83ba6d3f]:
  - get-workspaces@0.3.0

## 1.1.3

### Patch Changes

- [67db935d](https://github.com/Noviny/changesets/commit/67db935d) - Fix release without built files

## 1.1.2

### Patch Changes

- [c6f1c7b7](https://github.com/Noviny/changesets/commit/c6f1c7b7) [#46](https://github.com/Noviny/changesets/pull/46) Thanks [@mitchellhamilton](https://github.com/mitchellhamilton)! - Convert a file to TypeScript
- [9fe9ecff](https://github.com/Noviny/changesets/commit/9fe9ecff) [#45](https://github.com/Noviny/changesets/pull/45) Thanks [@Noviny](https://github.com/Noviny)! - Print out the last changes.md path in terminal as last step of adding a changeset
- [61ac9ce7](https://github.com/Noviny/changesets/commit/61ac9ce7) [#42](https://github.com/Noviny/changesets/pull/42) Thanks [@mitchellhamilton](https://github.com/mitchellhamilton)! - Make "All changed packages" option first in package list

- Updated dependencies [355b4d00]:
  - get-workspaces@0.2.0

## 1.1.1

### Patch Changes

- [b93d04a2](https://github.com/Noviny/changesets/commit/b93d04a2) - Consume get-workspaces as dependency
- [079eabae](https://github.com/Noviny/changesets/commit/079eabae) [#33](https://github.com/Noviny/changesets/pull/33) Thanks [@mitchellhamilton](https://github.com/mitchellhamilton)! - Fix a bug with linked packages where it would break if there was a linked package that didn't have a changeset

- Updated dependencies [b93d04a2]:
  - get-workspaces@0.1.0

## 1.1.0

### Minor Changes

- [6929624b](https://github.com/Noviny/changesets/commit/6929624b) [#27](https://github.com/Noviny/changesets/pull/27) Thanks [@mitchellhamilton](https://github.com/mitchellhamilton)! - Add linked packages/lockstep

## 1.0.1

### Patch Changes

- 9435d886: Fix binary and published files

## 1.0.0

### Major Changes

- 51c8b0d6: Remove `noChangelog` flag in favor of `updateChangelog` flag (default behaviour remains the same).

  If you were using this custom flag, you will need to replaces `noChangelog: true` with `updateChangelog: false`

- 51c8b0d6: Rename commands from @atlaskit/build-releases

  We are no longer mirroring the names from npm/yarn commands, so it is easy to write package scripts
  for each command without footguns. The functionality of the commands remains the same. In addition,
  the binary has been changed to `changeset`.

  The new names are:

  - `build-releases initialize` => `changeset init` (for ecosystem consistency)
  - `build-releases changeset` => `changeset` (default command). You can also run `changeset add`
  - `build-releases version` => `changeset bump`
  - `build-releases publish` => `changeset release`

  The function of these commands remains unchanged.

  - 51c8b0d6: Change format of changelog entries

  Previously changelog entries were in the form of:

  ```md
  ## 2.1.0

  - [patch] Allows passing --public flag for publishing scoped packages [159c28e](https://bitbucket.org/changesets/atlaskit-mk-2/commits/159c28e)
  - [minor] Changes changelogs to be opt out rather than opt in [f461788](https://bitbucket.org/changesets/atlaskit-mk-2/commits/f461788)
  ```

  which doesn't take into account the importance of particular entries. We are moving to an ordered system for changelog
  entries, and to match this, we are updating the headings we use to the following format:

  ```md
  ## 2.1.0

  ### Minor

  - Allows passing --public flag for publishing scoped packages [159c28e](https://bitbucket.org/changesets/atlaskit-mk-2/commits/159c28e)

  ### Patch

  - [minor] Changes changelogs to be opt out rather than opt in [f461788](https://bitbucket.org/changesets/atlaskit-mk-2/commits/f461788)
  ```

  This changes the format of the default `getReleaseLine` from

  ```js
  const getReleaseLine = async (changeset, versionType) => {
    const indentedSummary = changeset.summary
      .split("\n")
      .map((l) => `  ${l}`.trimRight())
      .join("\n");

    return `- [${versionType}] ${changeset.commit}:\n\n${indentedSummary}`;
  };
  ```

  to

  ```js
  const getReleaseLine = async (changeset, type) => {
    const [firstLine, ...futureLines] = changeset.summary
      .split("\n")
      .map((l) => l.trimRight());

    return `- ${changeset.commit}: ${firstLine}\n${futureLines
      .map((l) => `  ${l}`)
      .join("\n")}`;
  };
  ```

  You will end up with some odd changelog entries if you do not update your release line.

### Minor Changes

- 51c8b0d6: Support non-bolt repositories

  Changesets have been expanded to support:

  - bolt repositories
  - yarn workspaces-based repositories
  - single package repositories.

  Currently **not** supported: bolt repositories with nested workspaces.

  To do this, functions that call out to bolt have been inlined, and obviously marked
  within the file-system. In addition, the `get-workspaces` function has undergone
  significant change, and will be extracted out into its own package soon.

  This is to support other tools wanting this level of interoperability.

  If plans to modularize bolt proceed, we may go back to relying on its functions.

  This should have no impact on use.

  - 51c8b0d6: Add 'select all' and 'select all changed' options, to make mass-bumping easier.
  - eeb4d5c6: Add new command: `status` - see Readme for more information

# @atlaskit/build-releases - legacy changelog

## 3.0.3

- [patch][c87337f](https://bitbucket.org/changesets/atlaskit-mk-2/commits/c87337f):

  - The version command now removes empty folders before it starts. This should prevent a race condition in CI

## 3.0.2

- [patch][f7b030a](https://bitbucket.org/changesets/atlaskit-mk-2/commits/f7b030a):

  - Fixes potential infinite loop in parseChangesetCommit

## 3.0.1

- [patch][494c1fe](https://bitbucket.org/changesets/atlaskit-mk-2/commits/494c1fe):

  - Update git commit message to match previous tooling.

## 3.0.0

- [major][44ec8bf" d](<https://bitbucket.org/changesets/atlaskit-mk-2/commits/44ec8bf>"
  d):

  Changesets now use local file system - this has several effects:

  1. Changesets will no longer automatically create a commit. You will need to add and commit the files yourself.
  2. Changesets are easier to modify. You should ONLY modify the changes.md file (_Not changes.json_).
  3. There will be a new directory which is `.changeset`, which will hold all the changesets.

  Apart from these changes, your process using this should not have changed.

  Changeset now accepts skipCI flag, where previously release commits automatically skipped CI. i.e.

  ```
  yarn build-releases version --skipCI
  ```

  **Breaking**: Changeset and version commands now accept `--commit` flag which makes them commit automatically (previously this was the default behaviour). Otherwise, these commands simply make the file-system changes.

  ```
  yarn build-releases changeset --commit
  ```

  We also introduce the `intitialize` command. See the package [README.md](https://www.npmjs.com/package/@atlaskit/build-releases) for more details about this.

## 2.1.3

- [patch] Bumps bolt version to get some bug fixes around publishing [493f5f7](https://bitbucket.org/changesets/atlaskit-mk-2/commits/493f5f7)

## 2.1.2

- [patch] Pulls in fix in bolt causing publishing to fail when running a yarn subprocess (see boltpkg/bolt #189) [2b36121](https://bitbucket.org/changesets/atlaskit-mk-2/commits/2b36121)

## 2.1.1

- [patch] Fixes bug where empty summaries would cause a changeset to not get found [25b30bf](https://bitbucket.org/changesets/atlaskit-mk-2/commits/25b30bf)

## 2.1.0

- [minor] Allows passing --public flag for publishing scoped packages [159c28e](https://bitbucket.org/changesets/atlaskit-mk-2/commits/159c28e)
- [minor] Changes changelogs to be opt out rather than opt in [f461788](https://bitbucket.org/changesets/atlaskit-mk-2/commits/f461788)

## 2.0.0

- [major] Completely refactors build-releases to be externally consumable 8458ef7](<https://bitbucket.org/changesets/atlaskit-mk-2/commits/8458ef7>)

## 1.28.2

- [patch] Bug fix and better error messages for changeset error [7f09b86](https://bitbucket.org/changesets/atlaskit-mk-2/commits/7f09b86)

## 1.28.1

- [patch] update flow dep, fix flow errors [722ad83](https://bitbucket.org/changesets/atlaskit-mk-2/commits/722ad83)

## 1.28.0

- [minor] Adds tagging to releases [34c64fd](https://bitbucket.org/changesets/atlaskit-mk-2/commits/34c64fd)

## 1.27.0

- [minor] Splits out and exposes flattenChangesets function [5ee5f74](https://bitbucket.org/changesets/atlaskit-mk-2/commits/5ee5f74)

## 1.26.0

- [minor] Lots of new features (consider this package unstable and only for use internally) [7cdf2e6](https://bitbucket.org/changesets/atlaskit-mk-2/commits/7cdf2e6)
