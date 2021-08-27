# @changesets/changelog-github

## 0.4.1

### Patch Changes

- Updated dependencies [[`e89e28a`](https://github.com/atlassian/changesets/commit/e89e28a05f5fa43307db73812a6bcd269b62ddee)]:
  - @changesets/types@4.0.1

## 0.4.0

### Minor Changes

- [#564](https://github.com/atlassian/changesets/pull/564) [`707002d`](https://github.com/atlassian/changesets/commit/707002dec9332a2c1322522a23861e747a6bff6f) Thanks [@Andarist](https://github.com/Andarist)! - It's now possible to specify multiple authors of a change by using multiple `author: @someuser` lines.

### Patch Changes

- Updated dependencies [[`de2b4a5`](https://github.com/atlassian/changesets/commit/de2b4a5a7b244a37d94625bcb70ecde9dde5b612)]:
  - @changesets/types@4.0.0

## 0.3.0

### Minor Changes

- [#535](https://github.com/atlassian/changesets/pull/535) [`91d1ef2`](https://github.com/atlassian/changesets/commit/91d1ef2ef703be6b727650ef67a932757b97d1ef) Thanks [@mitchellhamilton](https://github.com/mitchellhamilton)! - Allow replacing the PR/commit/author shown in the changlog line by writing `pr: some-pr-number` and similarly for `commit` and `author` in the changlog summary(not the frontmatter).

### Patch Changes

- Updated dependencies [[`91d1ef2`](https://github.com/atlassian/changesets/commit/91d1ef2ef703be6b727650ef67a932757b97d1ef)]:
  - @changesets/get-github-info@0.5.0

## 0.2.8

### Patch Changes

- [`3436c53`](https://github.com/atlassian/changesets/commit/3436c53acf444c2ce19f8548920b7b73461a9c76) [#510](https://github.com/atlassian/changesets/pull/510) Thanks [@tuanddd](https://github.com/tuanddd)! - Added validation rule for invalid `repo` arguments.

- Updated dependencies [[`3436c53`](https://github.com/atlassian/changesets/commit/3436c53acf444c2ce19f8548920b7b73461a9c76)]:
  - @changesets/get-github-info@0.4.5

## 0.2.7

### Patch Changes

- [`f24f722`](https://github.com/atlassian/changesets/commit/f24f7220fcc322a4a2deb26cd77c2d481ac422f0) [#444](https://github.com/atlassian/changesets/pull/444) Thanks [@Andarist](https://github.com/Andarist)! - Changed the way how requests to the GitHub API were authenticated - from a query parameter to the `Authorization` header. The previously used method has been deprecated by the GitHub and will stop working in 2021.

- Updated dependencies [[`f24f722`](https://github.com/atlassian/changesets/commit/f24f7220fcc322a4a2deb26cd77c2d481ac422f0)]:
  - @changesets/get-github-info@0.4.4

## 0.2.6

### Patch Changes

- Updated dependencies [[`2b49d66`](https://github.com/atlassian/changesets/commit/2b49d668ecaa1333bc5c7c5be4648dda1b11528d)]:
  - @changesets/types@3.0.0

## 0.2.5

### Patch Changes

- [`1706fb7`](https://github.com/atlassian/changesets/commit/1706fb751ecc2f5a792c42f467b2063078d58716) [#321](https://github.com/atlassian/changesets/pull/321) Thanks [@mitchellhamilton](https://github.com/mitchellhamilton)! - Fix TypeScript declarations

- Updated dependencies [[`1706fb7`](https://github.com/atlassian/changesets/commit/1706fb751ecc2f5a792c42f467b2063078d58716)]:
  - @changesets/get-github-info@0.4.3
  - @changesets/types@2.0.1

## 0.2.4

### Patch Changes

- Updated dependencies [[`011d57f`](https://github.com/atlassian/changesets/commit/011d57f1edf9e37f75a8bef4f918e72166af096e)]:
  - @changesets/types@2.0.0

## 0.2.3

### Patch Changes

- [`e56928b`](https://github.com/atlassian/changesets/commit/e56928bbd6f9096def06ac37487bdbf28efec9d1) [#298](https://github.com/atlassian/changesets/pull/298) Thanks [@eps1lon](https://github.com/eps1lon)! - In changelog-github, throw more descriptive error when no options are provided.

- Updated dependencies [[`04ddfd7`](https://github.com/atlassian/changesets/commit/04ddfd7c3acbfb84ef9c92873fe7f9dea1f5145c), [`e56928b`](https://github.com/atlassian/changesets/commit/e56928bbd6f9096def06ac37487bdbf28efec9d1)]:
  - @changesets/get-github-info@0.4.2
  - @changesets/types@1.0.1

## 0.2.2

### Patch Changes

- Updated dependencies [[`41e2e3d`](https://github.com/atlassian/changesets/commit/41e2e3dd1053ff2f35a1a07e60793c9099f26997), [`cc8c921`](https://github.com/atlassian/changesets/commit/cc8c92143d4c4b7cca8b9917dfc830a40b5cda20), [`cc8c921`](https://github.com/atlassian/changesets/commit/cc8c92143d4c4b7cca8b9917dfc830a40b5cda20), [`2363366`](https://github.com/atlassian/changesets/commit/2363366756d1b15bddf6d803911baccfca03cbdf)]:
  - @changesets/types@1.0.0

## 0.2.1

### Patch Changes

- [`16bf3017`](https://github.com/atlassian/changesets/commit/16bf3017dbf25d498fee028bf9806d15edd61be9) [#229](https://github.com/atlassian/changesets/pull/229) Thanks [@mitchellhamilton](https://github.com/mitchellhamilton)! - Fix the author of a PR not being queried

- Updated dependencies [[`503154db`](https://github.com/atlassian/changesets/commit/503154db39fe8ab88a1176e4569c48078bcf5569), [`16bf3017`](https://github.com/atlassian/changesets/commit/16bf3017dbf25d498fee028bf9806d15edd61be9)]:
  - @changesets/get-github-info@0.4.1

## 0.2.0

### Minor Changes

- [`938823f`](https://github.com/atlassian/changesets/commit/938823f6fa0277869f0aecc3345c3812d1e44bba) [#224](https://github.com/atlassian/changesets/pull/224) - Show the PR author of a change rather than the author of the commit that added a changeset to account for cases when maintainers add a changeset to a PR and merge the PR with a merge commit

### Patch Changes

- [`938823f`](https://github.com/atlassian/changesets/commit/938823f6fa0277869f0aecc3345c3812d1e44bba) [#224](https://github.com/atlassian/changesets/pull/224) - Fix cases where the wrong PR is returned when a commit is associated with multiple PRs
- Updated dependencies [[`938823f`](https://github.com/atlassian/changesets/commit/938823f6fa0277869f0aecc3345c3812d1e44bba), [`938823f`](https://github.com/atlassian/changesets/commit/938823f6fa0277869f0aecc3345c3812d1e44bba)]:
  - @changesets/get-github-info@0.4.0

## 0.1.1

### Patch Changes

- Updated dependencies [[`8f0a1ef`](https://github.com/atlassian/changesets/commit/8f0a1ef327563512f471677ef0ca99d30da009c0)]:
  - @changesets/types@0.4.0

## 0.1.0

### Minor Changes

- [`bb855a8`](https://github.com/atlassian/changesets/commit/bb855a869b2d1c4454929b62c3b768546c30d3a3) [#170](https://github.com/atlassian/changesets/pull/170) Thanks [@mitchellhamilton](https://github.com/mitchellhamilton)! - Create package

### Patch Changes

- Updated dependencies [[`bb855a8`](https://github.com/atlassian/changesets/commit/bb855a869b2d1c4454929b62c3b768546c30d3a3), [`bb855a8`](https://github.com/atlassian/changesets/commit/bb855a869b2d1c4454929b62c3b768546c30d3a3)]:
  - @changesets/get-github-info@0.3.0
