import changelogFunctions from "./index";
import parse from "@changesets/parse";

const getReleaseLine = changelogFunctions.getReleaseLine;

jest.mock(
  "@changesets/get-github-info",
  (): typeof import("@changesets/get-github-info") => {
    // this is duplicated because jest.mock reordering things
    const data = {
      commit: "a085003",
      user: "Andarist",
      pull: 1613,
      repo: "emotion-js/emotion",
    };
    const links = {
      user: `[@${data.user}](https://github.com/${data.user})`,
      pull: `[#${data.pull}](https://github.com/${data.repo}/pull/${data.pull})`,
      commit: `[\`${data.commit}\`](https://github.com/${data.repo}/commit/${data.commit})`,
    };
    return {
      async getInfo({ commit, repo }) {
        /* eslint-disable jest/no-standalone-expect */
        expect(commit).toBe(data.commit);
        expect(repo).toBe(data.repo);
        /* eslint-enable jest/no-standalone-expect */
        return {
          pull: data.pull,
          user: data.user,
          links,
        };
      },
      async getInfoFromPullRequest({ pull, repo }) {
        /* eslint-disable jest/no-standalone-expect */
        expect(pull).toBe(data.pull);
        expect(repo).toBe(data.repo);
        /* eslint-enable jest/no-standalone-expect */
        return {
          commit: data.commit,
          user: data.user,
          links,
        };
      },
    };
  }
);

const getChangeset = (content: string, commit: string | undefined) => {
  return [
    {
      ...parse(
        `---
  pkg: "minor"
  ---

  something
  ${content}
  `
      ),
      id: "some-id",
      commit,
    },
    "minor",
    { repo: data.repo },
  ] as const;
};

const data = {
  commit: "a085003",
  user: "Andarist",
  pull: 1613,
  repo: "emotion-js/emotion",
};

describe.each([data.commit, "wrongcommit", undefined])(
  "with commit from changeset of %s",
  (commitFromChangeset) => {
    // eslint-disable-next-line jest/max-nested-describe
    describe.each(["pr", "pull request", "pull"])(
      "override pr with %s keyword",
      (keyword) => {
        test.each(["with #", "without #"] as const)("%s", async (kind) => {
          await expect(
            getReleaseLine(
              ...getChangeset(
                `${keyword}: ${kind === "with #" ? "#" : ""}${data.pull}`,
                commitFromChangeset
              )
            )
          ).resolves.toEqual(
            `\n\n- [#1613](https://github.com/emotion-js/emotion/pull/1613) [\`a085003\`](https://github.com/emotion-js/emotion/commit/a085003) Thanks [@Andarist](https://github.com/Andarist)! - something\n`
          );
        });
      }
    );
    test("override commit with commit keyword", async () => {
      await expect(
        getReleaseLine(
          ...getChangeset(`commit: ${data.commit}`, commitFromChangeset)
        )
      ).resolves.toEqual(
        `\n\n- [#1613](https://github.com/emotion-js/emotion/pull/1613) [\`a085003\`](https://github.com/emotion-js/emotion/commit/a085003) Thanks [@Andarist](https://github.com/Andarist)! - something\n`
      );
    });
  }
);

describe.each(["author", "user"])(
  "override author with %s keyword",
  (keyword) => {
    test.each(["with @", "without @"] as const)("%s", async (kind) => {
      await expect(
        getReleaseLine(
          ...getChangeset(
            `${keyword}: ${kind === "with @" ? "@" : ""}other`,
            data.commit
          )
        )
      ).resolves.toEqual(
        `\n\n- [#1613](https://github.com/emotion-js/emotion/pull/1613) [\`a085003\`](https://github.com/emotion-js/emotion/commit/a085003) Thanks [@other](https://github.com/other)! - something\n`
      );
    });
  }
);

it("with multiple authors", async () => {
  await expect(
    getReleaseLine(
      ...getChangeset(
        ["author: @Andarist", "author: @mitchellhamilton"].join("\n"),
        data.commit
      )
    )
  ).resolves.toMatchInlineSnapshot(`
    "

    - [#1613](https://github.com/emotion-js/emotion/pull/1613) [\`a085003\`](https://github.com/emotion-js/emotion/commit/a085003) Thanks [@Andarist](https://github.com/Andarist), [@mitchellhamilton](https://github.com/mitchellhamilton)! - something
    "
  `);
});
