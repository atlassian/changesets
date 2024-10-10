import path from "path";
import stripAnsi from "strip-ansi";
import * as git from "@changesets/git";
import { defaultConfig } from "@changesets/config";
import { silenceLogsInBlock, testdir } from "@changesets/test-utils";
import writeChangeset from "@changesets/write";

import {
  askCheckboxPlus,
  askConfirm,
  askQuestionWithEditor,
  askQuestion,
  askList,
} from "../../../utils/cli-utilities.ts";
import addChangeset from "../index.ts";

jest.mock("../../../utils/cli-utilities");
jest.mock("@changesets/git");
jest.mock("@changesets/write");
// @ts-ignore
writeChangeset.mockImplementation(() => Promise.resolve("abcdefg"));
// @ts-ignore
git.commit.mockImplementation(() => Promise.resolve(true));

// @ts-ignore
git.getChangedPackagesSinceRef.mockImplementation(({ ref }) => {
  expect(ref).toBe("master");
  return [];
});

// @ts-ignore
const mockUserResponses = (mockResponses) => {
  const summary = mockResponses.summary || "summary message mock";
  let majorReleases: Array<string> = [];
  let minorReleases: Array<string> = [];
  Object.entries(mockResponses.releases).forEach(([pkgName, type]) => {
    if (type === "major") {
      majorReleases.push(pkgName);
    } else if (type === "minor") {
      minorReleases.push(pkgName);
    }
  });
  let callCount = 0;
  let returnValues = [
    Object.keys(mockResponses.releases),
    majorReleases,
    minorReleases,
  ];
  // @ts-ignore
  askCheckboxPlus.mockImplementation(() => {
    if (callCount === returnValues.length) {
      throw new Error(`There was an unexpected call to askCheckboxPlus`);
    }
    return returnValues[callCount++];
  });

  let confirmAnswers = {
    "Is this your desired changeset?": true,
  };

  if (mockResponses.consoleSummaries && mockResponses.editorSummaries) {
    let i = 0;
    let j = 0;
    // @ts-ignore
    askQuestion.mockImplementation(() => mockResponses.consoleSummaries[i++]);
    // @ts-ignore
    askQuestionWithEditor.mockImplementation(
      () => mockResponses.editorSummaries[j++]
    );
  } else {
    // @ts-ignore
    askQuestion.mockReturnValueOnce(summary);
  }

  // @ts-ignore
  askConfirm.mockImplementation((question) => {
    question = stripAnsi(question);
    // @ts-ignore
    if (confirmAnswers[question]) {
      // @ts-ignore
      return confirmAnswers[question];
    }
    throw new Error(`An answer could not be found for ${question}`);
  });
};

describe("Add command", () => {
  silenceLogsInBlock();

  it("should generate changeset to patch a single package", async () => {
    const cwd = await testdir({
      "package.json": JSON.stringify({
        private: true,
        workspaces: ["packages/*"],
      }),
      "packages/pkg-a/package.json": JSON.stringify({
        name: "pkg-a",
        version: "1.0.0",
      }),
      "packages/pkg-b/package.json": JSON.stringify({
        name: "pkg-b",
        version: "1.0.0",
      }),
    });

    mockUserResponses({ releases: { "pkg-a": "patch" } });
    await addChangeset(cwd, { empty: false }, defaultConfig);

    // @ts-ignore
    const call = writeChangeset.mock.calls[0][0];
    expect(call).toEqual(
      expect.objectContaining({
        summary: "summary message mock",
        releases: [{ name: "pkg-a", type: "patch" }],
      })
    );
  });

  it.each`
    consoleSummaries                          | editorSummaries                           | expectedSummary
    ${["summary on step 1"]}                  | ${[]}                                     | ${"summary on step 1"}
    ${[""]}                                   | ${["summary in external editor"]}         | ${"summary in external editor"}
    ${["", "summary after editor cancelled"]} | ${[""]}                                   | ${"summary after editor cancelled"}
    ${["", "summary after error"]}            | ${1 /* mock implementation will throw */} | ${"summary after error"}
  `(
    "should read summary",
    // @ts-ignore
    async ({ consoleSummaries, editorSummaries, expectedSummary }) => {
      const cwd = await testdir({
        "package.json": JSON.stringify({
          private: true,
          workspaces: ["packages/*"],
        }),
        "packages/pkg-a/package.json": JSON.stringify({
          name: "pkg-a",
          version: "1.0.0",
        }),
        "packages/pkg-b/package.json": JSON.stringify({
          name: "pkg-b",
          version: "1.0.0",
        }),
      });

      mockUserResponses({
        releases: { "pkg-a": "patch" },
        consoleSummaries,
        editorSummaries,
      });
      await addChangeset(cwd, { empty: false }, defaultConfig);

      // @ts-ignore
      const call = writeChangeset.mock.calls[0][0];
      expect(call).toEqual(
        expect.objectContaining({
          summary: expectedSummary,
          releases: [{ name: "pkg-a", type: "patch" }],
        })
      );
    }
  );

  it("should generate a changeset in a single package repo", async () => {
    const cwd = await testdir({
      "package.json": JSON.stringify({
        private: true,
        name: "single-package",
        version: "1.0.0",
      }),
    });

    const summary = "summary message mock";

    // @ts-ignore
    askList.mockReturnValueOnce(Promise.resolve("minor"));

    let confirmAnswers = {
      "Is this your desired changeset?": true,
    };
    // @ts-ignore
    askQuestion.mockReturnValueOnce("");
    // @ts-ignore
    askQuestionWithEditor.mockReturnValueOnce(summary);
    // @ts-ignore
    askConfirm.mockImplementation((question) => {
      question = stripAnsi(question);
      // @ts-ignore
      if (confirmAnswers[question]) {
        // @ts-ignore
        return confirmAnswers[question];
      }
      throw new Error(`An answer could not be found for ${question}`);
    });

    await addChangeset(cwd, { empty: false }, defaultConfig);

    // @ts-ignore
    const call = writeChangeset.mock.calls[0][0];
    expect(call).toEqual(
      expect.objectContaining({
        summary: "summary message mock",
        releases: [{ name: "single-package", type: "minor" }],
      })
    );
  });

  it("should commit when the commit flag is passed in", async () => {
    const cwd = await testdir({
      "package.json": JSON.stringify({
        private: true,
        workspaces: ["packages/*"],
      }),
      "packages/pkg-a/package.json": JSON.stringify({
        name: "pkg-a",
        version: "1.0.0",
        dependencies: {
          "pkg-b": "1.0.0",
        },
      }),
      "packages/pkg-b/package.json": JSON.stringify({
        name: "pkg-b",
        version: "1.0.0",
      }),
    });

    mockUserResponses({ releases: { "pkg-a": "patch" } });
    await addChangeset(
      cwd,
      { empty: false },
      {
        ...defaultConfig,
        commit: [path.resolve(__dirname, "..", "..", "..", "commit"), null],
      }
    );
    expect(git.add).toHaveBeenCalledTimes(1);
    expect(git.commit).toHaveBeenCalledTimes(1);
  });

  it("should create empty changeset when empty flag is passed in", async () => {
    const cwd = await testdir({
      "package.json": JSON.stringify({
        private: true,
        workspaces: ["packages/*"],
      }),
      "packages/pkg-a/package.json": JSON.stringify({
        name: "pkg-a",
        version: "1.0.0",
      }),
    });

    await addChangeset(cwd, { empty: true }, defaultConfig);

    // @ts-ignore
    const call = writeChangeset.mock.calls[0][0];
    expect(call).toEqual(
      expect.objectContaining({
        releases: [],
        summary: "",
      })
    );
  });

  it("should not include ignored packages in the prompt", async () => {
    const cwd = await testdir({
      "package.json": JSON.stringify({
        private: true,
        workspaces: ["packages/*"],
      }),
      "packages/pkg-a/package.json": JSON.stringify({
        name: "pkg-a",
        version: "1.0.3",
        dependencies: {
          "pkg-b": "~1.2.0",
        },
      }),
      "packages/pkg-b/package.json": JSON.stringify({
        name: "pkg-b",
        version: "1.2.0",
        dependencies: {
          "pkg-c": "2.0.0",
          "pkg-a": "^1.0.3",
        },
      }),
      "packages/pkg-c/package.json": JSON.stringify({
        name: "pkg-c",
        version: "2.0.0",
        dependencies: {
          "pkg-a": "^1.0.3",
        },
      }),
    });

    mockUserResponses({ releases: { "pkg-a": "patch" } });
    await addChangeset(
      cwd,
      { empty: false },
      { ...defaultConfig, ignore: ["pkg-b"] }
    );

    // @ts-ignore
    const { choices } = askCheckboxPlus.mock.calls[0][1][0];
    expect(choices).toEqual(["pkg-a", "pkg-c"]);
  });

  it("should not include private packages without a version in the prompt", async () => {
    const cwd = await testdir({
      "package.json": JSON.stringify({
        private: true,
        workspaces: ["packages/*"],
      }),
      "packages/pkg-a/package.json": JSON.stringify({
        name: "pkg-a",
        version: "1.0.0",
      }),
      "packages/pkg-b/package.json": JSON.stringify({
        name: "pkg-b",
        private: true,
      }),
      "packages/pkg-c/package.json": JSON.stringify({
        name: "pkg-c",
        version: "1.0.0",
      }),
    });

    mockUserResponses({ releases: { "pkg-a": "patch" } });
    await addChangeset(cwd, { empty: false }, defaultConfig);

    // @ts-ignore
    const { choices } = askCheckboxPlus.mock.calls[0][1][0];
    expect(choices).toEqual(["pkg-a", "pkg-c"]);
  });

  it("should not include private packages with a version in the prompt if private packages are configured to be not versionable", async () => {
    const cwd = await testdir({
      "package.json": JSON.stringify({
        private: true,
        workspaces: ["packages/*"],
      }),
      "packages/pkg-a/package.json": JSON.stringify({
        name: "pkg-a",
        version: "1.0.0",
      }),
      "packages/pkg-b/package.json": JSON.stringify({
        name: "pkg-b",
        version: "1.0.0",
        private: true,
      }),
      "packages/pkg-c/package.json": JSON.stringify({
        name: "pkg-c",
        version: "1.0.0",
      }),
    });

    mockUserResponses({ releases: { "pkg-a": "patch" } });
    await addChangeset(
      cwd,
      { empty: false },
      {
        ...defaultConfig,
        privatePackages: {
          version: false,
          tag: false,
        },
      }
    );

    // @ts-ignore
    const { choices } = askCheckboxPlus.mock.calls[0][1][0];
    expect(choices).toEqual(["pkg-a", "pkg-c"]);
  });
});
