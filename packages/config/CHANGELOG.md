# @changesets/config

## 4.0.0-next.0

### Major Changes

- [#1479](https://github.com/changesets/changesets/pull/1479) [`7f34a00`](https://github.com/changesets/changesets/commit/7f34a00aab779a941a406b17f5a85895144fc0a5) Thanks [@bluwy](https://github.com/bluwy)! - Add `"engines"` field for explicit node version support. The supported node versions are `>=18.0.0`.

### Patch Changes

- [#1476](https://github.com/changesets/changesets/pull/1476) [`e0e1748`](https://github.com/changesets/changesets/commit/e0e1748369b1f936c665b62590a76a0d57d1545e) Thanks [@ziebam](https://github.com/ziebam)! - Replace `fs-extra` usage with `node:fs`

- Updated dependencies [[`7f34a00`](https://github.com/changesets/changesets/commit/7f34a00aab779a941a406b17f5a85895144fc0a5)]:
  - @changesets/get-dependents-graph@3.0.0-next.0
  - @changesets/errors@0.3.0-next.0
  - @changesets/logger@0.2.0-next.0
  - @changesets/types@7.0.0-next.0

## 3.0.3

### Patch Changes

- Updated dependencies [[`bc75c1a`](https://github.com/changesets/changesets/commit/bc75c1a74c2d46e08620c7aa0e9f4f5ef40a9b55), [`52c302a`](https://github.com/changesets/changesets/commit/52c302a48a662f71585f18f91dad3cbe49d75890)]:
  - @changesets/get-dependents-graph@2.1.2
  - @changesets/logger@0.1.1

## 3.0.2

### Patch Changes

- [#1400](https://github.com/changesets/changesets/pull/1400) [`dd6e5bb`](https://github.com/changesets/changesets/commit/dd6e5bbf74e246d7a742aa50424989462679b0ca) Thanks [@Andarist](https://github.com/Andarist)! - Fixed a crash when validating `ignore` while parsing the config in a scenario when a workspace depends on the root workspace

- Updated dependencies [[`dd6e5bb`](https://github.com/changesets/changesets/commit/dd6e5bbf74e246d7a742aa50424989462679b0ca)]:
  - @changesets/get-dependents-graph@2.1.1

## 3.0.1

### Patch Changes

- Updated dependencies [[`5e9d33a`](https://github.com/changesets/changesets/commit/5e9d33a2e659abdcf26f204a76a9465cf4b26d6b)]:
  - @changesets/get-dependents-graph@2.1.0

## 3.0.0

### Major Changes

- [#1185](https://github.com/changesets/changesets/pull/1185) [`a971652`](https://github.com/changesets/changesets/commit/a971652ec1403aab3fb89eb2f1640bd5012b895a) Thanks [@Andarist](https://github.com/Andarist)! - `package.json#exports` have been added to limit what (and how) code might be imported from the package.

### Patch Changes

- Updated dependencies [[`a971652`](https://github.com/changesets/changesets/commit/a971652ec1403aab3fb89eb2f1640bd5012b895a)]:
  - @changesets/get-dependents-graph@2.0.0
  - @changesets/errors@0.2.0
  - @changesets/logger@0.1.0
  - @changesets/types@6.0.0

## 2.3.1

### Patch Changes

- Updated dependencies [[`41988ce`](https://github.com/changesets/changesets/commit/41988ceb8c1cedd3857c939448bf3965494ff0a4)]:
  - @changesets/get-dependents-graph@1.3.6

## 2.3.0

### Minor Changes

- [#1033](https://github.com/changesets/changesets/pull/1033) [`521205d`](https://github.com/changesets/changesets/commit/521205dc8c70fe71b181bd3c4bb7c9c6d2e721d2) Thanks [@Andarist](https://github.com/Andarist)! - Support and validation for the new `changedFilePatterns` option has been added.

### Patch Changes

- Updated dependencies [[`521205d`](https://github.com/changesets/changesets/commit/521205dc8c70fe71b181bd3c4bb7c9c6d2e721d2)]:
  - @changesets/types@5.2.1
  - @changesets/get-dependents-graph@1.3.5

## 2.2.0

### Minor Changes

- [#662](https://github.com/changesets/changesets/pull/662) [`8c08469`](https://github.com/changesets/changesets/commit/8c0846977597ddaf51aaeb35f1f0f9428bf8ba14) Thanks [@JakeGinnivan](https://github.com/JakeGinnivan)! - Added support for the `privatePackages` property in the config.

### Patch Changes

- Updated dependencies [[`8c08469`](https://github.com/changesets/changesets/commit/8c0846977597ddaf51aaeb35f1f0f9428bf8ba14)]:
  - @changesets/types@5.2.0
  - @changesets/get-dependents-graph@1.3.4

## 2.1.1

### Patch Changes

- [#900](https://github.com/changesets/changesets/pull/900) [`7d998ee`](https://github.com/changesets/changesets/commit/7d998eeb16064b5442ebc49ad31dec7b841d504e) Thanks [@sdirosa](https://github.com/sdirosa)! - Include the information about `false` being a valid value for the `changelog` option in the validation message for the `changelog` option.

## 2.1.0

### Minor Changes

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

- Updated dependencies [[`dd9b76f`](https://github.com/changesets/changesets/commit/dd9b76f162a546ae8b412e0cb10277f971f3585e)]:
  - @changesets/types@5.1.0
  - @changesets/get-dependents-graph@1.3.3

## 2.0.1

### Patch Changes

- [#854](https://github.com/changesets/changesets/pull/854) [`2827c7a`](https://github.com/changesets/changesets/commit/2827c7ab33af30065fafe72ede1a2a6ac88d5276) Thanks [@Andarist](https://github.com/Andarist)! - Fixed the declared JSON schema type for the `changelog` config option.

- [#852](https://github.com/changesets/changesets/pull/852) [`7b1c0c1`](https://github.com/changesets/changesets/commit/7b1c0c1b73a19b50fe3a104acb440c604eab108f) Thanks [@caohuilin](https://github.com/caohuilin)! - Fixed the declared JSON schema type for the `commit` config option.

## 2.0.0

### Major Changes

- [#768](https://github.com/changesets/changesets/pull/768) [`c87eba6`](https://github.com/changesets/changesets/commit/c87eba6f80a34563b7382f87472c29f6dafb546c) Thanks [@rohit-gohri](https://github.com/rohit-gohri)! - The parsed config now normalzied the commit option to either `false` or a tuple describing what module should be loaded to resolve commit functions.

### Patch Changes

- Updated dependencies [[`c87eba6`](https://github.com/changesets/changesets/commit/c87eba6f80a34563b7382f87472c29f6dafb546c)]:
  - @changesets/types@5.0.0
  - @changesets/get-dependents-graph@1.3.2

## 1.7.0

### Minor Changes

- [#690](https://github.com/changesets/changesets/pull/690) [`27a5a82`](https://github.com/changesets/changesets/commit/27a5a82188914570d192162f9d045dfd082a3c15) Thanks [@Andarist](https://github.com/Andarist)! - Added parsing and validating of the new `fixed` option. The description for this option has also been added to the JSON schema.

### Patch Changes

- Updated dependencies [[`27a5a82`](https://github.com/changesets/changesets/commit/27a5a82188914570d192162f9d045dfd082a3c15)]:
  - @changesets/types@4.1.0
  - @changesets/get-dependents-graph@1.3.1

## 1.6.4

### Patch Changes

- Updated dependencies [[`6f9c9d6`](https://github.com/changesets/changesets/commit/6f9c9d60c0e02c79d555c48deb01559057f1d252)]:
  - @changesets/get-dependents-graph@1.3.0

## 1.6.3

### Patch Changes

- [#667](https://github.com/changesets/changesets/pull/667) [`fe8db75`](https://github.com/changesets/changesets/commit/fe8db7500f81caea9064f8bec02bcb77e0fd8fce) Thanks [@fz6m](https://github.com/fz6m)! - Upgraded `@manypkg/get-packages` dependency to fix getting correct packages in pnpm workspaces with exclude rules.

- Updated dependencies [[`fe8db75`](https://github.com/changesets/changesets/commit/fe8db7500f81caea9064f8bec02bcb77e0fd8fce), [`9a993ba`](https://github.com/changesets/changesets/commit/9a993ba09629c1620d749432520470cec49d3a96)]:
  - @changesets/get-dependents-graph@1.2.4
  - @changesets/types@4.0.2

## 1.6.2

### Patch Changes

- Updated dependencies [[`74dda8c`](https://github.com/changesets/changesets/commit/74dda8c0d8bd1741ca7b19f0ccb37b2330dc9549)]:
  - @changesets/get-dependents-graph@1.2.3

## 1.6.1

### Patch Changes

- Updated dependencies [[`e89e28a`](https://github.com/changesets/changesets/commit/e89e28a05f5fa43307db73812a6bcd269b62ddee)]:
  - @changesets/types@4.0.1
  - @changesets/get-dependents-graph@1.2.2

## 1.6.0

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

### Patch Changes

- Updated dependencies [[`de2b4a5`](https://github.com/changesets/changesets/commit/de2b4a5a7b244a37d94625bcb70ecde9dde5b612)]:
  - @changesets/types@4.0.0
  - @changesets/get-dependents-graph@1.2.1

## 1.5.0

### Minor Changes

- [`12f9a43`](https://github.com/changesets/changesets/commit/12f9a433a6c3ac38f9405fcd77c9108c423d7101) [#507](https://github.com/changesets/changesets/pull/507) Thanks [@zkochan](https://github.com/zkochan)! - New setting added: bumpVersionsWithWorkspaceProtocolOnly. When it is set to `true`, versions are bumped in `dependencies`, only if those versions are prefixed by the workspace protocol. For instance, `"foo": "workspace:^1.0.0"`.

### Patch Changes

- Updated dependencies [[`12f9a43`](https://github.com/changesets/changesets/commit/12f9a433a6c3ac38f9405fcd77c9108c423d7101)]:
  - @changesets/get-dependents-graph@1.2.0
  - @changesets/types@3.3.0

## 1.4.0

### Minor Changes

- [`e33e4ca`](https://github.com/changesets/changesets/commit/e33e4ca7e71ba7747e21af5011057f11ddfab939) [#458](https://github.com/changesets/changesets/pull/458) Thanks [@emmenko](https://github.com/emmenko)! - Allow glob expressions to be provided for the `linked` and `ignore` options

### Patch Changes

- Updated dependencies [[`f4973a2`](https://github.com/changesets/changesets/commit/f4973a25ec6a837f36d64c1fb4b108ace3bc1f9d)]:
  - @changesets/types@3.2.0

## 1.3.0

### Minor Changes

- [`377f5c3`](https://github.com/changesets/changesets/commit/377f5c385ad9db4ff8458f159e2d452c39828567) [#393](https://github.com/changesets/changesets/pull/393) Thanks [@Andarist](https://github.com/Andarist)! - Added `updateInternalDependencies` and `ignore` options to the JSON schema.

### Patch Changes

- [`377f5c3`](https://github.com/changesets/changesets/commit/377f5c385ad9db4ff8458f159e2d452c39828567) [#393](https://github.com/changesets/changesets/pull/393) Thanks [@Andarist](https://github.com/Andarist)! - Removed experimental flags from `defaultWrittenConfig`. They were added there by mistake.

## 1.2.0

### Minor Changes

- [`9dcc364`](https://github.com/changesets/changesets/commit/9dcc364bf19e48f8f2824ebaf967d9ef41b6fc04) [#371](https://github.com/changesets/changesets/pull/371) Thanks [@Feiyang1](https://github.com/Feiyang1)! - Add `ignore` config option to configure ignored packages. The versions of ignored packages will not be bumped during a release, but their dependencies will still be bumped normally.

### Patch Changes

- [`addd725`](https://github.com/changesets/changesets/commit/addd7256d9251d999251a7c16c0a0b068d557b5d) [#383](https://github.com/changesets/changesets/pull/383) Thanks [@Feiyang1](https://github.com/Feiyang1)! - Added an experimental flag `onlyUpdatePeerDependentsWhenOutOfRange`. When set to `true`, we only bump peer dependents when peerDependencies are leaving range.

- Updated dependencies [[`addd725`](https://github.com/changesets/changesets/commit/addd7256d9251d999251a7c16c0a0b068d557b5d), [`9dcc364`](https://github.com/changesets/changesets/commit/9dcc364bf19e48f8f2824ebaf967d9ef41b6fc04)]:
  - @changesets/types@3.1.0

## 1.1.0

### Minor Changes

- [`2b49d66`](https://github.com/changesets/changesets/commit/2b49d668ecaa1333bc5c7c5be4648dda1b11528d) [#358](https://github.com/changesets/changesets/pull/358) Thanks [@Blasz](https://github.com/Blasz)! - Add new updateInternalDependencies config option to disable auto bumping of internal dependencies in the same release if the dependency was only patch bumped

### Patch Changes

- Updated dependencies [[`2b49d66`](https://github.com/changesets/changesets/commit/2b49d668ecaa1333bc5c7c5be4648dda1b11528d)]:
  - @changesets/types@3.0.0

## 1.0.3

### Patch Changes

- [`1706fb7`](https://github.com/changesets/changesets/commit/1706fb751ecc2f5a792c42f467b2063078d58716) [#321](https://github.com/changesets/changesets/pull/321) Thanks [@mitchellhamilton](https://github.com/mitchellhamilton)! - Fix TypeScript declarations

- Updated dependencies [[`1706fb7`](https://github.com/changesets/changesets/commit/1706fb751ecc2f5a792c42f467b2063078d58716)]:
  - @changesets/errors@0.1.4
  - @changesets/logger@0.0.5
  - @changesets/types@2.0.1

## 1.0.2

### Patch Changes

- Updated dependencies [[`011d57f`](https://github.com/changesets/changesets/commit/011d57f1edf9e37f75a8bef4f918e72166af096e)]:
  - @changesets/types@2.0.0

## 1.0.1

### Patch Changes

- [`04ddfd7`](https://github.com/changesets/changesets/commit/04ddfd7c3acbfb84ef9c92873fe7f9dea1f5145c) [#305](https://github.com/changesets/changesets/pull/305) Thanks [@Noviny](https://github.com/Noviny)! - Add link to changelog in readme

- [`b49e1cf`](https://github.com/changesets/changesets/commit/b49e1cff65dca7fe9e341a35aa91704aa0e51cb3) [#306](https://github.com/changesets/changesets/pull/306) Thanks [@Andarist](https://github.com/Andarist)! - Ignore `node_modules` when glob searching for packages. This fixes an issue with package cycles.

- Updated dependencies [[`04ddfd7`](https://github.com/changesets/changesets/commit/04ddfd7c3acbfb84ef9c92873fe7f9dea1f5145c), [`e56928b`](https://github.com/changesets/changesets/commit/e56928bbd6f9096def06ac37487bdbf28efec9d1)]:
  - @changesets/errors@0.1.3
  - @changesets/logger@0.0.4
  - @changesets/types@1.0.1

## 1.0.0

### Major Changes

- [`cc8c921`](https://github.com/changesets/changesets/commit/cc8c92143d4c4b7cca8b9917dfc830a40b5cda20) [#290](https://github.com/changesets/changesets/pull/290) Thanks [@mitchellhamilton](https://github.com/mitchellhamilton)! - Accept `Packages` object from `@manypkg/get-workspaces` instead of `Workspace[]` from `get-workspaces`

### Patch Changes

- Updated dependencies [[`41e2e3d`](https://github.com/changesets/changesets/commit/41e2e3dd1053ff2f35a1a07e60793c9099f26997), [`cc8c921`](https://github.com/changesets/changesets/commit/cc8c92143d4c4b7cca8b9917dfc830a40b5cda20), [`cc8c921`](https://github.com/changesets/changesets/commit/cc8c92143d4c4b7cca8b9917dfc830a40b5cda20), [`2363366`](https://github.com/changesets/changesets/commit/2363366756d1b15bddf6d803911baccfca03cbdf)]:
  - @changesets/types@1.0.0

## 0.3.0

### Minor Changes

- [`bca8865`](https://github.com/changesets/changesets/commit/bca88652d38caa31e789c4564230ba0b49562ad2) [#221](https://github.com/changesets/changesets/pull/221) Thanks [@mitchellhamilton](https://github.com/mitchellhamilton)! - Added support for `baseBranch` option which specifies what branch Changesets should use when determining what packages have changed

## 0.2.4

### Patch Changes

- Updated dependencies [[`9cd1eaf`](https://github.com/changesets/changesets/commit/9cd1eafc1620894a39fe10d3e393ad8f812df53a)]:
  - @changesets/logger@0.0.3

## 0.2.3

### Patch Changes

- Updated dependencies [[`8f0a1ef`](https://github.com/changesets/changesets/commit/8f0a1ef327563512f471677ef0ca99d30da009c0), [`8f0a1ef`](https://github.com/changesets/changesets/commit/8f0a1ef327563512f471677ef0ca99d30da009c0), [`8f0a1ef`](https://github.com/changesets/changesets/commit/8f0a1ef327563512f471677ef0ca99d30da009c0)]:
  - @changesets/types@0.4.0
  - @changesets/errors@0.1.2
  - @changesets/logger@0.0.2

## 0.2.2

### Patch Changes

- [`5ababa0`](https://github.com/changesets/changesets/commit/5ababa08c8ea5ee3b4ff92253e2e752a5976cd27) [#201](https://github.com/changesets/changesets/pull/201) Thanks [@ajaymathur](https://github.com/ajaymathur)! - Updated to use the Error classes from the @changesets/errors package

- [`a679b1d`](https://github.com/changesets/changesets/commit/a679b1dcdcb56652d31536e2d6326ba02a9dfe62) [#204](https://github.com/changesets/changesets/pull/204) Thanks [@Andarist](https://github.com/Andarist)! - Correctly handle the 'access' flag for packages

  Previously, we had access as "public" or "private", access "private" isn't valid. This was a confusing because there are three states for publishing a package:

  - `private: true` - the package will not be published to npm (worked)
  - `access: public` - the package will be publicly published to npm (even if it uses a scope) (worked)
  - `access: restricted` - the package will be published to npm, but only visible/accessible by those who are part of the scope. This technically worked, but we were passing the wrong bit of information in.

  Now, we pass the correct access options `public` or `restricted`.

- Updated dependencies [[`51a0d76`](https://github.com/changesets/changesets/commit/51a0d766c7064b4c6a9d1490593522c6fcd02929), [`a679b1d`](https://github.com/changesets/changesets/commit/a679b1dcdcb56652d31536e2d6326ba02a9dfe62), [`5ababa0`](https://github.com/changesets/changesets/commit/5ababa08c8ea5ee3b4ff92253e2e752a5976cd27)]:
  - @changesets/logger@0.0.1
  - @changesets/types@0.3.1
  - @changesets/errors@0.1.1

## 0.2.1

### Patch Changes

- Updated dependencies [8c43fa0, 1ff73b7]:
  - @changesets/types@0.3.0

## 0.2.0

### Minor Changes

- [296a6731](https://github.com/changesets/changesets/commit/296a6731) - Safety bump: Towards the end of preparing changesets v2, there was a lot of chaos - this bump is to ensure every package on npm matches what is found in the repository.

### Patch Changes

- Updated dependencies [296a6731]:
  - @changesets/types@0.2.0

## 0.1.2

### Patch Changes

- [a15abbf9](https://github.com/changesets/changesets/commit/a15abbf9) - Previous release shipped unbuilt code - fixing that

## 0.1.0

### Minor Changes

- [519b4218](https://github.com/changesets/changesets/commit/519b4218) - Initial release with parse and read functions along with defaultConfig and defaultWrittenConfig

- Updated dependencies [519b4218]:
  - @changesets/types@0.1.0
