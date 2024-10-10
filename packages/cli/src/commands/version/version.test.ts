import fs from "fs-extra";
import path from "path";
import * as git from "@changesets/git";
import { warn } from "@changesets/logger";
import { silenceLogsInBlock, testdir } from "@changesets/test-utils";
import writeChangeset from "@changesets/write";
import { Config, Changeset } from "@changesets/types";
import { defaultConfig } from "@changesets/config";
import { getPackages } from "@manypkg/get-packages";
import pre from "../pre";
import version from "./index";
import humanId from "human-id";

function mockGlobalDate<
  Args extends any[],
  Return extends Promise<void> | void
>(
  testFn: (...args: Args) => Return,
  fixedDate: string = "2021-12-13T00:07:30.879Z"
) {
  return async (...args: Args) => {
    const originalDate = Date;
    const MockedDate = class MockedDate extends Date {
      constructor() {
        super(fixedDate);
      }

      static now() {
        return new MockedDate().getTime();
      }
    } as typeof Date;

    // eslint-disable-next-line no-global-assign
    Date = MockedDate;

    try {
      await testFn(...args);
    } finally {
      // eslint-disable-next-line no-global-assign
      Date = originalDate;
    }
  };
}

let changelogPath = path.resolve(__dirname, "../../changelog");
let commitPath = path.resolve(__dirname, "../../commit");
let modifiedDefaultConfig: Config = {
  ...defaultConfig,
  changelog: [changelogPath, null],
};

let defaultOptions = {
  snapshot: undefined,
};

// avoid polluting test logs with error message in console
// This is from bolt's error log
const consoleError = console.error;

jest.mock("human-id");
const humanIdMocked = jest.mocked(humanId);

jest.mock("@changesets/logger");

jest.mock("@changesets/git");
jest.spyOn(git, "add").mockResolvedValue(true);
jest.spyOn(git, "commit").mockResolvedValue(true);
jest
  .spyOn(git, "getCommitsThatAddFiles")
  .mockImplementation((changesetIds) =>
    Promise.resolve(changesetIds.map(() => "g1th4sh"))
  );
jest.spyOn(git, "getCurrentCommitId").mockResolvedValue("abcdef");
jest.spyOn(git, "tag").mockResolvedValue(true);

const writeChangesets = (changesets: Changeset[], cwd: string) => {
  return Promise.all(
    changesets.map((changeset) => writeChangeset(changeset, cwd))
  );
};

const getFile = (pkgName: string, fileName: string, calls: any) => {
  let castCalls: [string, string][] = calls;
  const foundCall = castCalls.find((call) =>
    call[0].endsWith(`${pkgName}${path.sep}${fileName}`)
  );
  if (!foundCall)
    throw new Error(`could not find writing of ${fileName} for: ${pkgName}`);

  // return written content
  return foundCall[1];
};

const getPkgJSON = (pkgName: string, calls: any) => {
  return JSON.parse(getFile(pkgName, "package.json", calls));
};

const getChangelog = (pkgName: string, calls: any) => {
  return getFile(pkgName, "CHANGELOG.md", calls);
};

beforeEach(() => {
  let i = 0;
  humanIdMocked.mockImplementation(() => `some-id-${i++}`);

  console.error = jest.fn();
});

afterEach(() => {
  console.error = consoleError;
});

describe("running version in a simple project", () => {
  silenceLogsInBlock();

  describe("when there are no changeset commits", () => {
    it("should warn if no changeset commits exist", async () => {
      const cwd = await testdir({
        "package.json": JSON.stringify({
          private: true,
          workspaces: ["packages/*"],
        }),
        "packages/pkg-a/package.json": JSON.stringify({
          name: "pkg-a",
          version: "1.0.0",
        }),
        ".changeset/config.json": JSON.stringify({}),
      });
      await version(cwd, defaultOptions, modifiedDefaultConfig);
      const loggerWarnCalls = jest.mocked(warn).mock.calls;
      expect(loggerWarnCalls.length).toEqual(1);
      expect(loggerWarnCalls[0][0]).toEqual(
        "No unreleased changesets found, exiting."
      );
    });
  });

  describe("when there is a changeset commit", () => {
    it("should bump releasedPackages", async () => {
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
      await writeChangesets(
        [
          {
            summary: "This is a summary too",
            releases: [
              { name: "pkg-a", type: "minor" },
              { name: "pkg-b", type: "patch" },
            ],
          },
        ],
        cwd
      );
      const spy = jest.spyOn(fs, "writeFile");

      await version(cwd, defaultOptions, modifiedDefaultConfig);

      expect(getPkgJSON("pkg-a", spy.mock.calls)).toEqual(
        expect.objectContaining({ name: "pkg-a", version: "1.1.0" })
      );
      expect(getPkgJSON("pkg-b", spy.mock.calls)).toEqual(
        expect.objectContaining({ name: "pkg-b", version: "1.0.1" })
      );
    });
  });

  it("should not touch package.json of an ignored package when it is not a dependent of any releasedPackages ", async () => {
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
    await writeChangesets(
      [
        {
          summary: "This is a summary",
          releases: [{ name: "pkg-a", type: "minor" }],
        },
      ],
      cwd
    );
    const spy = jest.spyOn(fs, "writeFile");

    await version(cwd, defaultOptions, {
      ...modifiedDefaultConfig,
      ignore: ["pkg-a"],
    });

    const bumpedPackageA = !!spy.mock.calls.find((call: string[]) =>
      call[0].endsWith(`pkg-a${path.sep}package.json`)
    );

    expect(bumpedPackageA).toBe(false);
  });

  it("should not bump ignored packages", async () => {
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
    await writeChangesets(
      [
        {
          summary: "This is a summary",
          releases: [{ name: "pkg-a", type: "minor" }],
        },
        {
          summary: "This is not a summary",
          releases: [{ name: "pkg-b", type: "patch" }],
        },
      ],
      cwd
    );

    await version(cwd, defaultOptions, {
      ...modifiedDefaultConfig,
      ignore: ["pkg-a"],
    });

    expect((await getPackages(cwd)).packages.map((x) => x.packageJson))
      .toMatchInlineSnapshot(`
      [
        {
          "dependencies": {
            "pkg-b": "1.0.1",
          },
          "name": "pkg-a",
          "version": "1.0.0",
        },
        {
          "name": "pkg-b",
          "version": "1.0.1",
        },
      ]
    `);
  });

  it("should not commit the result if commit config is not set", async () => {
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
    await writeChangesets(
      [
        {
          summary: "This is a summary",
          releases: [{ name: "pkg-a", type: "minor" }],
        },
      ],
      cwd
    );
    const spy = jest.spyOn(git, "commit");

    await version(cwd, defaultOptions, modifiedDefaultConfig);

    expect(spy).not.toHaveBeenCalled();
  });

  it("should git add the expected files if commit config is set", async () => {
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
    const ids = await writeChangesets(
      [
        {
          summary: "This is a summary too",
          releases: [
            { name: "pkg-a", type: "minor" },
            { name: "pkg-b", type: "patch" },
          ],
        },
      ],
      cwd
    );
    const spy = jest.spyOn(git, "add");

    expect(spy).not.toHaveBeenCalled();

    await version(cwd, defaultOptions, {
      ...modifiedDefaultConfig,
      commit: [commitPath, null],
    });

    expect(spy).toHaveBeenCalled();

    expect(spy).toHaveBeenCalledWith("packages/pkg-a/package.json", cwd);
    expect(spy).toHaveBeenCalledWith("packages/pkg-a/CHANGELOG.md", cwd);

    expect(spy).toHaveBeenCalledWith("packages/pkg-b/package.json", cwd);
    expect(spy).toHaveBeenCalledWith("packages/pkg-b/CHANGELOG.md", cwd);

    expect(spy).toHaveBeenCalledWith(`.changeset/${ids[0]}.md`, cwd);
  });

  it("should commit the result if commit config is set", async () => {
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
    await writeChangesets(
      [
        {
          summary: "This is a summary too",
          releases: [
            { name: "pkg-a", type: "minor" },
            { name: "pkg-b", type: "patch" },
          ],
        },
      ],
      cwd
    );
    const spy = jest.spyOn(git, "commit");

    expect(spy).not.toHaveBeenCalled();

    await version(cwd, defaultOptions, {
      ...modifiedDefaultConfig,
      commit: [commitPath, null],
    });

    expect(spy).toHaveBeenCalled();
    expect(spy.mock.calls[0][0]).toMatchInlineSnapshot(`
      "RELEASING: Releasing 2 package(s)

      Releases:
        pkg-a@1.1.0
        pkg-b@1.0.1
      "
    `);
  });

  it("should skip over ignored changesets", async () => {
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
      ".changeset/changesets-are-beautiful.md": `---
"pkg-a": minor
---

Nice simple summary, much wow
`,
      ".changeset/.ignored-temporarily.md": `---
"pkg-b": minor
---

Awesome feature, hidden behind a feature flag
`,
    });

    await version(cwd, defaultOptions, modifiedDefaultConfig);

    let packages = await getPackages(cwd);
    expect(packages.packages.map((x) => x.packageJson)).toEqual([
      {
        name: "pkg-a",
        version: "1.1.0",
        dependencies: {
          "pkg-b": "1.0.0",
        },
      },
      {
        name: "pkg-b",
        version: "1.0.0",
      },
    ]);

    const changesetDir = await fs.readdir(path.join(cwd, ".changeset"));
    // should still contain the ignored changeset
    expect(changesetDir).toContain(".ignored-temporarily.md");
  });

  it("should not update a dependant that uses a tag as a dependency rage for a package that could otherwise be local", async () => {
    const cwd = await testdir({
      "package.json": JSON.stringify({
        private: true,
        workspaces: ["examples/*", "packages/*"],
      }),
      "packages/pkg-a/package.json": JSON.stringify({
        name: "pkg-a",
        version: "1.0.0",
      }),
      "examples/example-a/package.json": JSON.stringify({
        name: "example-a",
        version: "1.0.0",
        dependencies: {
          "pkg-a": "latest",
        },
      }),
    });

    await writeChangeset(
      {
        releases: [{ name: "pkg-a", type: "major" }],
        summary: "a very useful summary for the change",
      },
      cwd
    );

    await version(cwd, defaultOptions, modifiedDefaultConfig);

    expect((await getPackages(cwd)).packages.map((x) => x.packageJson))
      .toMatchInlineSnapshot(`
      [
        {
          "dependencies": {
            "pkg-a": "latest",
          },
          "name": "example-a",
          "version": "1.0.0",
        },
        {
          "name": "pkg-a",
          "version": "2.0.0",
        },
      ]
    `);
  });

  describe("when there are multiple changeset commits", () => {
    it("should bump releasedPackages", async () => {
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
      await writeChangesets(
        [
          {
            summary: "This is a summary",
            releases: [{ name: "pkg-a", type: "minor" }],
          },
          {
            summary: "This is a summary too",
            releases: [
              { name: "pkg-a", type: "minor" },
              { name: "pkg-b", type: "patch" },
            ],
          },
        ],
        cwd
      );
      const spy = jest.spyOn(fs, "writeFile");

      await version(cwd, defaultOptions, modifiedDefaultConfig);

      expect(getPkgJSON("pkg-a", spy.mock.calls)).toEqual(
        expect.objectContaining({ name: "pkg-a", version: "1.1.0" })
      );
      expect(getPkgJSON("pkg-b", spy.mock.calls)).toEqual(
        expect.objectContaining({ name: "pkg-b", version: "1.0.1" })
      );
    });

    it("should bump multiple released packages if required", async () => {
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
      await writeChangesets(
        [
          {
            summary: "This is a summary",
            releases: [{ name: "pkg-a", type: "minor" }],
          },
          {
            summary: "This is a summary too",
            releases: [
              { name: "pkg-a", type: "minor" },
              { name: "pkg-b", type: "patch" },
            ],
          },
        ],
        cwd
      );
      const spy = jest.spyOn(fs, "writeFile");
      await version(cwd, defaultOptions, modifiedDefaultConfig);

      // first call should be minor bump
      expect(getPkgJSON("pkg-a", spy.mock.calls)).toEqual(
        expect.objectContaining({
          name: "pkg-a",
          version: "1.1.0",
        })
      );
      // second should be a patch
      expect(getPkgJSON("pkg-b", spy.mock.calls)).toEqual(
        expect.objectContaining({
          name: "pkg-b",
          version: "1.0.1",
        })
      );
    });
    it("should delete the changeset files", async () => {
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
        ".changeset/config.json": JSON.stringify({}),
      });

      await writeChangesets(
        [
          {
            summary: "This is a summary",
            releases: [{ name: "pkg-a", type: "minor" }],
          },
          {
            summary: "This is a summary too",
            releases: [
              { name: "pkg-a", type: "minor" },
              { name: "pkg-b", type: "patch" },
            ],
          },
        ],
        cwd
      );
      expect((await fs.readdir(path.resolve(cwd, ".changeset"))).length).toBe(
        3
      );

      await version(cwd, defaultOptions, modifiedDefaultConfig);
      expect((await fs.readdir(path.resolve(cwd, ".changeset"))).length).toBe(
        1
      );
    });
  });
});

describe("fixed", () => {
  it("should bump packages to the correct versions when packages are fixed", async () => {
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
    await writeChangesets(
      [
        {
          summary: "This is a summary",
          releases: [{ name: "pkg-a", type: "minor" }],
        },
      ],
      cwd
    );
    const spy = jest.spyOn(fs, "writeFile");

    await version(cwd, defaultOptions, {
      ...modifiedDefaultConfig,
      fixed: [["pkg-a", "pkg-b"]],
    });

    expect(getPkgJSON("pkg-a", spy.mock.calls)).toEqual(
      expect.objectContaining({ name: "pkg-a", version: "1.1.0" })
    );
    expect(getPkgJSON("pkg-b", spy.mock.calls)).toEqual(
      expect.objectContaining({ name: "pkg-b", version: "1.1.0" })
    );
  });

  it("should not bump an ignored fixed package that depends on a package from the group that is being released", async () => {
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
    await writeChangesets(
      [
        {
          summary: "This is not a summary",
          releases: [{ name: "pkg-b", type: "patch" }],
        },
      ],
      cwd
    );

    await version(cwd, defaultOptions, {
      ...modifiedDefaultConfig,
      fixed: [["pkg-a", "pkg-b"]],
      ignore: ["pkg-a"],
    });

    expect((await getPackages(cwd)).packages.map((x) => x.packageJson))
      .toMatchInlineSnapshot(`
      [
        {
          "dependencies": {
            "pkg-b": "1.0.1",
          },
          "name": "pkg-a",
          "version": "1.0.0",
        },
        {
          "name": "pkg-b",
          "version": "1.0.1",
        },
      ]
    `);
  });

  it("should update CHANGELOGs of all packages from the fixed group", async () => {
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
    const spy = jest.spyOn(fs, "writeFile");

    await writeChangesets(
      [
        {
          summary: "This is a summary",
          releases: [{ name: "pkg-a", type: "minor" }],
        },
      ],
      cwd
    );

    await version(cwd, defaultOptions, {
      ...modifiedDefaultConfig,
      fixed: [["pkg-a", "pkg-b"]],
    });

    expect(getChangelog("pkg-a", spy.mock.calls)).toMatchInlineSnapshot(`
      "# pkg-a

      ## 1.1.0

      ### Minor Changes

      - g1th4sh: This is a summary

      ### Patch Changes

      - pkg-b@1.1.0
      "
    `);
    expect(getChangelog("pkg-b", spy.mock.calls)).toMatchInlineSnapshot(`
      "# pkg-b

      ## 1.1.0
      "
    `);

    spy.mockClear();

    await writeChangesets(
      [
        {
          summary: "This is a summary",
          releases: [{ name: "pkg-a", type: "minor" }],
        },
      ],
      cwd
    );

    await version(cwd, defaultOptions, {
      ...modifiedDefaultConfig,
      fixed: [["pkg-a", "pkg-b"]],
    });

    expect(getChangelog("pkg-a", spy.mock.calls)).toMatchInlineSnapshot(`
      "# pkg-a

      ## 1.2.0

      ### Minor Changes

      - g1th4sh: This is a summary

      ### Patch Changes

      - pkg-b@1.2.0

      ## 1.1.0

      ### Minor Changes

      - g1th4sh: This is a summary

      ### Patch Changes

      - pkg-b@1.1.0
      "
    `);
    expect(getChangelog("pkg-b", spy.mock.calls)).toMatchInlineSnapshot(`
      "# pkg-b

      ## 1.2.0

      ## 1.1.0
      "
    `);
  });
});

describe("linked", () => {
  it("should bump packages to the correct versions when packages are linked", async () => {
    const cwd = await testdir({
      "package.json": JSON.stringify({
        private: true,
        workspaces: ["packages/*"],
      }),
      "packages/pkg-a/package.json": JSON.stringify({
        name: "pkg-a",
        version: "1.0.0",
        dependencies: {
          "pkg-b": "0.1.0",
        },
      }),
      "packages/pkg-b/package.json": JSON.stringify({
        name: "pkg-b",
        version: "0.1.0",
      }),
    });
    await writeChangesets(
      [
        {
          summary: "This is a summary too",
          releases: [
            { name: "pkg-a", type: "minor" },
            { name: "pkg-b", type: "patch" },
          ],
        },
      ],
      cwd
    );
    const spy = jest.spyOn(fs, "writeFile");

    await version(cwd, defaultOptions, {
      ...modifiedDefaultConfig,
      linked: [["pkg-a", "pkg-b"]],
    });

    expect(getPkgJSON("pkg-a", spy.mock.calls)).toEqual(
      expect.objectContaining({ name: "pkg-a", version: "1.1.0" })
    );
    expect(getPkgJSON("pkg-b", spy.mock.calls)).toEqual(
      expect.objectContaining({ name: "pkg-b", version: "1.1.0" })
    );
  });

  it("should not break when there is a linked package without a changeset", async () => {
    const cwd = await testdir({
      "package.json": JSON.stringify({
        private: true,
        workspaces: ["packages/*"],
      }),
      "packages/pkg-a/package.json": JSON.stringify({
        name: "pkg-a",
        version: "1.0.0",
        dependencies: {
          "pkg-b": "0.1.0",
        },
      }),
      "packages/pkg-b/package.json": JSON.stringify({
        name: "pkg-b",
        version: "0.1.0",
      }),
    });
    await writeChangesets(
      [
        {
          summary: "This is a summary",
          releases: [{ name: "pkg-a", type: "minor" }],
        },
      ],
      cwd
    );
    const spy = jest.spyOn(fs, "writeFile");

    await version(cwd, defaultOptions, {
      ...modifiedDefaultConfig,
      linked: [["pkg-1", "pkg-2"]],
    });

    expect(getPkgJSON("pkg-a", spy.mock.calls)).toEqual(
      expect.objectContaining({ name: "pkg-a", version: "1.1.0" })
    );
  });
});

describe("workspace range", () => {
  it("should update dependency range correctly", async () => {
    const cwd = await testdir({
      "package.json": JSON.stringify({
        private: true,
        workspaces: ["packages/*"],
      }),
      "packages/pkg-a/package.json": JSON.stringify({
        name: "pkg-a",
        version: "1.0.0",
        dependencies: {
          "pkg-b": "workspace:1.0.0",
        },
      }),
      "packages/pkg-b/package.json": JSON.stringify({
        name: "pkg-b",
        version: "1.0.0",
      }),
    });

    await writeChangesets(
      [
        {
          summary: "This is a summary too",
          releases: [
            { name: "pkg-a", type: "minor" },
            { name: "pkg-b", type: "patch" },
          ],
        },
      ],
      cwd
    );
    await version(cwd, defaultOptions, modifiedDefaultConfig);

    let packages = await getPackages(cwd);
    expect(packages.packages.map((x) => x.packageJson)).toEqual([
      {
        name: "pkg-a",
        version: "1.1.0",
        dependencies: {
          "pkg-b": "workspace:1.0.1",
        },
      },
      {
        name: "pkg-b",
        version: "1.0.1",
      },
    ]);
  });

  it("should bump dependent package when bumping a `workspace:*` dependency", async () => {
    const cwd = await testdir({
      "package.json": JSON.stringify({
        private: true,
        workspaces: ["packages/*"],
      }),
      "packages/pkg-a/package.json": JSON.stringify({
        name: "pkg-a",
        version: "1.0.0",
        dependencies: {
          "pkg-b": "workspace:*",
        },
      }),
      "packages/pkg-b/package.json": JSON.stringify({
        name: "pkg-b",
        version: "1.0.0",
      }),
    });

    await writeChangeset(
      {
        releases: [{ name: "pkg-b", type: "patch" }],
        summary: "a very useful summary for the change",
      },
      cwd
    );
    await version(cwd, defaultOptions, modifiedDefaultConfig);

    let packages = await getPackages(cwd);
    expect(packages.packages.map((x) => x.packageJson)).toEqual([
      {
        name: "pkg-a",
        version: "1.0.1",
        dependencies: {
          "pkg-b": "workspace:*",
        },
      },
      {
        name: "pkg-b",
        version: "1.0.1",
      },
    ]);
  });

  it("should bump dependent package when bumping a `workspace:^` dependency", async () => {
    const cwd = await testdir({
      "package.json": JSON.stringify({
        private: true,
        workspaces: ["packages/*"],
      }),
      "packages/pkg-a/package.json": JSON.stringify({
        name: "pkg-a",
        version: "1.0.0",
        dependencies: {
          "pkg-b": "workspace:^",
        },
      }),
      "packages/pkg-b/package.json": JSON.stringify({
        name: "pkg-b",
        version: "1.0.0",
      }),
    });

    await writeChangeset(
      {
        releases: [{ name: "pkg-b", type: "patch" }],
        summary: "a very useful summary for the change",
      },
      cwd
    );
    await version(cwd, defaultOptions, modifiedDefaultConfig);

    let packages = await getPackages(cwd);
    expect(packages.packages.map((x) => x.packageJson)).toEqual([
      {
        name: "pkg-a",
        version: "1.0.1",
        dependencies: {
          "pkg-b": "workspace:^",
        },
      },
      {
        name: "pkg-b",
        version: "1.0.1",
      },
    ]);
  });

  it("should update dependant CHANGELOGs with 'Dependency update' information", async () => {
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
        dependencies: { "pkg-a": "workspace:*" },
      }),
    });

    const spy = jest.spyOn(fs, "writeFile");
    await writeChangeset(
      {
        summary: "This is a summary",
        releases: [{ name: "pkg-a", type: "minor" }],
      },
      cwd
    );
    await version(cwd, defaultOptions, {
      ...modifiedDefaultConfig,
      ___experimentalUnsafeOptions_WILL_CHANGE_IN_PATCH: {
        ...defaultConfig.___experimentalUnsafeOptions_WILL_CHANGE_IN_PATCH,
        updateInternalDependents: "always",
      },
    });

    expect(getChangelog("pkg-a", spy.mock.calls)).toMatchInlineSnapshot(`
      "# pkg-a

      ## 1.1.0

      ### Minor Changes

      - g1th4sh: This is a summary
      "
    `);

    expect(getChangelog("pkg-b", spy.mock.calls)).toMatchInlineSnapshot(`
      "# pkg-b

      ## 1.0.1

      ### Patch Changes

      - Updated dependencies [g1th4sh]
        - pkg-a@1.1.0
      "
    `);
  });
});

describe("same package in different dependency types", () => {
  it("should update different range types correctly", async () => {
    let cwd = await testdir({
      "package.json": JSON.stringify({
        private: true,
        workspaces: ["packages/*"],
      }),
      "packages/pkg-a/package.json": JSON.stringify({
        name: "pkg-a",
        version: "1.0.0",
        peerDependencies: {
          "pkg-b": "^1.0.0",
        },
        devDependencies: {
          "pkg-b": "1.0.0",
        },
      }),
      "packages/pkg-b/package.json": JSON.stringify({
        name: "pkg-b",
        version: "1.0.0",
      }),
    });
    await writeChangeset(
      {
        releases: [
          {
            name: "pkg-b",
            type: "patch",
          },
        ],
        summary: "a very useful summary for the first change",
      },
      cwd
    );

    await version(cwd, defaultOptions, modifiedDefaultConfig);

    let packages = (await getPackages(cwd))!;
    expect(packages.packages.map((x) => x.packageJson)).toEqual([
      {
        devDependencies: {
          "pkg-b": "1.0.1",
        },
        peerDependencies: {
          "pkg-b": "^1.0.1",
        },
        name: "pkg-a",
        version: "1.0.0",
      },
      {
        name: "pkg-b",
        version: "1.0.1",
      },
    ]);
  });
});

describe("snapshot release", () => {
  it("should update the package to unique version no matter the kind of version bump it is", async () => {
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
    await writeChangesets(
      [
        {
          summary: "This is a summary too",
          releases: [
            { name: "pkg-a", type: "minor" },
            { name: "pkg-b", type: "patch" },
          ],
        },
      ],
      cwd
    );
    const spy = jest.spyOn(fs, "writeFile");
    await version(
      cwd,
      {
        snapshot: "experimental",
      },
      {
        ...modifiedDefaultConfig,
        commit: false,
      }
    );
    expect(getPkgJSON("pkg-a", spy.mock.calls)).toEqual(
      expect.objectContaining({
        name: "pkg-a",
        version: expect.stringContaining("0.0.0-experimental-"),
      })
    );

    expect(getPkgJSON("pkg-b", spy.mock.calls)).toEqual(
      expect.objectContaining({
        name: "pkg-b",
        version: expect.stringContaining("0.0.0-experimental-"),
      })
    );
  });

  it("should not commit the result even if commit config is set", async () => {
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
    await writeChangesets(
      [
        {
          summary: "This is a summary too",
          releases: [
            { name: "pkg-a", type: "minor" },
            { name: "pkg-b", type: "patch" },
          ],
        },
      ],
      cwd
    );
    const spy = jest.spyOn(git, "commit");

    expect(spy).not.toHaveBeenCalled();

    await version(
      cwd,
      {
        snapshot: "experimental",
      },
      {
        ...modifiedDefaultConfig,
        commit: [commitPath, null],
      }
    );

    expect(spy).not.toHaveBeenCalled();
  });

  it("should not bump version of a package with an explicit none release type", async () => {
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
    await writeChangeset(
      {
        releases: [{ name: "pkg-a", type: "none" }],
        summary: "some internal stuff",
      },
      cwd
    );

    await version(
      cwd,
      {
        snapshot: true,
      },
      modifiedDefaultConfig
    );

    expect((await getPackages(cwd)).packages.map((x) => x.packageJson))
      .toMatchInlineSnapshot(`
      [
        {
          "name": "pkg-a",
          "version": "1.0.0",
        },
      ]
    `);
  });

  it(
    "should not bump version of an ignored package when its dependency gets updated",
    mockGlobalDate(async () => {
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
      await writeChangeset(
        {
          releases: [{ name: "pkg-b", type: "major" }],
          summary: "a very useful summary",
        },
        cwd
      );

      await version(
        cwd,
        {
          snapshot: true,
        },
        {
          ...modifiedDefaultConfig,
          ignore: ["pkg-a"],
        }
      );

      expect((await getPackages(cwd)).packages.map((x) => x.packageJson))
        .toMatchInlineSnapshot(`
        [
          {
            "dependencies": {
              "pkg-b": "0.0.0-20211213000730",
            },
            "name": "pkg-a",
            "version": "1.0.0",
          },
          {
            "name": "pkg-b",
            "version": "0.0.0-20211213000730",
          },
        ]
      `);
    })
  );

  describe("snapshotPrereleaseTemplate", () => {
    it('should throw an error when "{tag}" and empty snapshot is used', async () => {
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
      await writeChangesets(
        [
          {
            summary: "This is a summary too",
            releases: [
              { name: "pkg-a", type: "minor" },
              { name: "pkg-b", type: "patch" },
            ],
          },
        ],
        cwd
      );
      jest.spyOn(fs, "writeFile");

      expect(
        version(
          cwd,
          { snapshot: true },
          {
            ...modifiedDefaultConfig,
            commit: false,
            snapshot: {
              ...modifiedDefaultConfig.snapshot,
              prereleaseTemplate: `{tag}.{commit}`,
            },
          }
        )
      ).rejects.toThrow(
        'Failed to compose snapshot version: "{tag}" placeholder is used without having a value defined!'
      );
    });

    it('should throw an error when "{tag}" is set and named snapshot is used', async () => {
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
      await writeChangesets(
        [
          {
            summary: "This is a summary too",
            releases: [
              { name: "pkg-a", type: "minor" },
              { name: "pkg-b", type: "patch" },
            ],
          },
        ],
        cwd
      );
      jest.spyOn(fs, "writeFile");

      expect(
        version(
          cwd,
          { snapshot: "test" },
          {
            ...modifiedDefaultConfig,
            commit: false,
            snapshot: {
              ...modifiedDefaultConfig.snapshot,
              prereleaseTemplate: `{commit}`,
            },
          }
        )
      ).rejects.toThrow(
        "Failed to compose snapshot version: \"{tag}\" placeholder is missing, but the snapshot parameter is defined (value: 'test')"
      );
    });

    it.each<[string | null | undefined, string | true, string]>([
      // Template-based
      ["{tag}", "test", "0.0.0-test"],
      ["{tag}-{tag}", "test", "0.0.0-test-test"],
      ["{commit}", true, "0.0.0-abcdef"],
      ["{timestamp}", true, "0.0.0-1639354050879"],
      ["{datetime}", true, "0.0.0-20211213000730"],
      // Mixing template and static string
      [
        "{tag}.{timestamp}.{commit}",
        "alpha",
        "0.0.0-alpha.1639354050879.abcdef",
      ],
      ["{datetime}-{tag}", "alpha", "0.0.0-20211213000730-alpha"],
      // Legacy support
      ["", "test", "0.0.0-test-20211213000730"],
      [undefined, "canary", "0.0.0-canary-20211213000730"],
      [null, "alpha", "0.0.0-alpha-20211213000730"],
    ])(
      "should customize release correctly based on snapshotPrereleaseTemplate template: %p (tag: '%p')",
      mockGlobalDate(
        async (snapshotTemplate, snapshotValue, expectedResult) => {
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
          await writeChangesets(
            [
              {
                summary: "This is a summary too",
                releases: [
                  { name: "pkg-a", type: "minor" },
                  { name: "pkg-b", type: "patch" },
                ],
              },
            ],
            cwd
          );
          const spy = jest.spyOn(fs, "writeFile");
          await version(
            cwd,
            { snapshot: snapshotValue },
            {
              ...modifiedDefaultConfig,
              commit: false,
              snapshot: {
                ...modifiedDefaultConfig.snapshot,
                prereleaseTemplate: snapshotTemplate as string,
              },
            }
          );

          expect(getPkgJSON("pkg-a", spy.mock.calls)).toEqual(
            expect.objectContaining({
              name: "pkg-a",
              version: expectedResult,
            })
          );

          expect(getPkgJSON("pkg-b", spy.mock.calls)).toEqual(
            expect.objectContaining({
              name: "pkg-b",
              version: expectedResult,
            })
          );
        }
      )
    );
  });

  describe("snapshot.useCalculatedVersion: true", () => {
    it("should update packages using calculated version", async () => {
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
      await writeChangesets(
        [
          {
            summary: "This is a summary too",
            releases: [
              { name: "pkg-a", type: "minor" },
              { name: "pkg-b", type: "patch" },
            ],
          },
        ],
        cwd
      );
      const spy = jest.spyOn(fs, "writeFile");
      await version(
        cwd,
        {
          snapshot: "experimental",
        },
        {
          ...modifiedDefaultConfig,
          commit: false,
          snapshot: {
            useCalculatedVersion: true,
            prereleaseTemplate: null,
          },
        }
      );
      expect(getPkgJSON("pkg-a", spy.mock.calls)).toEqual(
        expect.objectContaining({
          name: "pkg-a",
          version: expect.stringContaining("1.1.0-experimental-"),
        })
      );

      expect(getPkgJSON("pkg-b", spy.mock.calls)).toEqual(
        expect.objectContaining({
          name: "pkg-b",
          version: expect.stringContaining("1.0.1-experimental-"),
        })
      );
    });

    it("should not bump version of a package with an explicit none release type", async () => {
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
      await writeChangeset(
        {
          releases: [{ name: "pkg-a", type: "none" }],
          summary: "some internal stuff",
        },
        cwd
      );

      await version(
        cwd,
        {
          snapshot: true,
        },
        {
          ...modifiedDefaultConfig,
          snapshot: {
            useCalculatedVersion: true,
            prereleaseTemplate: null,
          },
        }
      );

      expect((await getPackages(cwd)).packages.map((x) => x.packageJson))
        .toMatchInlineSnapshot(`
        [
          {
            "name": "pkg-a",
            "version": "1.0.0",
          },
        ]
      `);
    });

    it(
      "should not bump version of an ignored package when its dependency gets updated",
      mockGlobalDate(async () => {
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
        await writeChangeset(
          {
            releases: [{ name: "pkg-b", type: "major" }],
            summary: "a very useful summary",
          },
          cwd
        );

        await version(
          cwd,
          {
            snapshot: true,
          },
          {
            ...modifiedDefaultConfig,
            ignore: ["pkg-a"],
            snapshot: {
              useCalculatedVersion: true,
              prereleaseTemplate: null,
            },
          }
        );

        expect((await getPackages(cwd)).packages.map((x) => x.packageJson))
          .toMatchInlineSnapshot(`
          [
            {
              "dependencies": {
                "pkg-b": "2.0.0-20211213000730",
              },
              "name": "pkg-a",
              "version": "1.0.0",
            },
            {
              "name": "pkg-b",
              "version": "2.0.0-20211213000730",
            },
          ]
        `);
      })
    );
  });
});

describe("updateInternalDependents: always", () => {
  it("should bump a direct dependent when a dependency package gets bumped", async () => {
    const cwd = await testdir({
      "package.json": JSON.stringify({
        private: true,
        workspaces: ["packages/*"],
      }),
      "packages/pkg-a/package.json": JSON.stringify({
        name: "pkg-a",
        version: "1.0.0",
        dependencies: {
          "pkg-b": "^1.0.0",
        },
      }),
      "packages/pkg-b/package.json": JSON.stringify({
        name: "pkg-b",
        version: "1.0.0",
      }),
    });
    const spy = jest.spyOn(fs, "writeFile");
    await writeChangeset(
      {
        summary: "This is not a summary",
        releases: [{ name: "pkg-b", type: "patch" }],
      },
      cwd
    );
    await version(cwd, defaultOptions, {
      ...modifiedDefaultConfig,
      ___experimentalUnsafeOptions_WILL_CHANGE_IN_PATCH: {
        ...defaultConfig.___experimentalUnsafeOptions_WILL_CHANGE_IN_PATCH,
        updateInternalDependents: "always",
      },
    });

    expect(getPkgJSON("pkg-a", spy.mock.calls)).toEqual(
      expect.objectContaining({
        name: "pkg-a",
        version: "1.0.1",
        dependencies: {
          "pkg-b": "^1.0.1",
        },
      })
    );
    expect(getPkgJSON("pkg-b", spy.mock.calls)).toEqual(
      expect.objectContaining({
        name: "pkg-b",
        version: "1.0.1",
      })
    );
    expect(getChangelog("pkg-a", spy.mock.calls)).toMatchInlineSnapshot(`
      "# pkg-a

      ## 1.0.1

      ### Patch Changes

      - Updated dependencies [g1th4sh]
        - pkg-b@1.0.1
      "
    `);
    expect(getChangelog("pkg-b", spy.mock.calls)).toMatchInlineSnapshot(`
      "# pkg-b

      ## 1.0.1

      ### Patch Changes

      - g1th4sh: This is not a summary
      "
    `);
  });

  it("should not bump a dev dependent nor its dependent when a package gets bumped", async () => {
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
        devDependencies: { "pkg-a": "1.0.0" },
      }),
      "packages/pkg-c/package.json": JSON.stringify({
        name: "pkg-c",
        version: "1.0.0",
        dependencies: { "pkg-b": "1.0.0" },
      }),
    });

    const spy = jest.spyOn(fs, "writeFile");
    await writeChangeset(
      {
        summary: "This is a summary",
        releases: [{ name: "pkg-a", type: "minor" }],
      },
      cwd
    );
    await version(cwd, defaultOptions, {
      ...modifiedDefaultConfig,
      ___experimentalUnsafeOptions_WILL_CHANGE_IN_PATCH: {
        ...defaultConfig.___experimentalUnsafeOptions_WILL_CHANGE_IN_PATCH,
        updateInternalDependents: "always",
      },
    });

    expect(getPkgJSON("pkg-a", spy.mock.calls)).toEqual(
      expect.objectContaining({
        name: "pkg-a",
        version: "1.1.0",
      })
    );
    expect(getPkgJSON("pkg-b", spy.mock.calls)).toEqual(
      expect.objectContaining({
        name: "pkg-b",
        version: "1.0.0",
        devDependencies: {
          "pkg-a": "1.1.0",
        },
      })
    );
    // `pkg-c` should not be touched
    expect(() => getPkgJSON("pkg-c", spy.mock.calls)).toThrowError();

    expect(getChangelog("pkg-a", spy.mock.calls)).toMatchInlineSnapshot(`
      "# pkg-a

      ## 1.1.0

      ### Minor Changes

      - g1th4sh: This is a summary
      "
    `);

    // pkg-b and - pkg-c are not being released so changelogs should not be
    // generated for them
    expect(() => getChangelog("pkg-b", spy.mock.calls)).toThrowError();
    expect(() => getChangelog("pkg-c", spy.mock.calls)).toThrowError();
  });

  it("should not bump dependant when it depends on an npm tag of a bumped dependency", async () => {
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
        dependencies: { "pkg-a": "bulbasaur" }, // using tag version from npm
      }),
    });

    const spy = jest.spyOn(fs, "writeFile");

    await writeChangeset(
      {
        summary: "This is some fix",
        releases: [{ name: "pkg-b", type: "patch" }],
      },
      cwd
    );
    await version(cwd, defaultOptions, {
      ...modifiedDefaultConfig,
      ___experimentalUnsafeOptions_WILL_CHANGE_IN_PATCH: {
        ...defaultConfig.___experimentalUnsafeOptions_WILL_CHANGE_IN_PATCH,
        updateInternalDependents: "always",
      },
    });

    expect(() => getPkgJSON("pkg-a", spy.mock.calls)).toThrow();

    expect(getPkgJSON("pkg-b", spy.mock.calls)).toEqual(
      expect.objectContaining({
        name: "pkg-b",
        version: "1.0.1",
        dependencies: { "pkg-a": "bulbasaur" },
      })
    );

    expect(() => getChangelog("pkg-a", spy.mock.calls)).toThrow();

    expect(getChangelog("pkg-b", spy.mock.calls)).toMatchInlineSnapshot(`
      "# pkg-b

      ## 1.0.1

      ### Patch Changes

      - g1th4sh: This is some fix
      "
    `);
  });

  it("should bump dependant when it depend on an npm tag of a bumped dependency when it has its own changeset", async () => {
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
        dependencies: { "pkg-a": "bulbasaur" }, // using tag version from npm
      }),
    });

    const spy = jest.spyOn(fs, "writeFile");
    await writeChangeset(
      {
        summary: "This is a summary",
        releases: [{ name: "pkg-a", type: "minor" }],
      },
      cwd
    );
    await writeChangeset(
      {
        summary: "This is some fix",
        releases: [{ name: "pkg-b", type: "patch" }],
      },
      cwd
    );
    await version(cwd, defaultOptions, {
      ...modifiedDefaultConfig,
      ___experimentalUnsafeOptions_WILL_CHANGE_IN_PATCH: {
        ...defaultConfig.___experimentalUnsafeOptions_WILL_CHANGE_IN_PATCH,
        updateInternalDependents: "always",
      },
    });

    expect(getPkgJSON("pkg-a", spy.mock.calls)).toEqual(
      expect.objectContaining({
        name: "pkg-a",
        version: "1.1.0",
      })
    );
    expect(getPkgJSON("pkg-b", spy.mock.calls)).toEqual(
      expect.objectContaining({
        name: "pkg-b",
        version: "1.0.1",
        dependencies: { "pkg-a": "bulbasaur" },
      })
    );

    expect(getChangelog("pkg-a", spy.mock.calls)).toMatchInlineSnapshot(`
      "# pkg-a

      ## 1.1.0

      ### Minor Changes

      - g1th4sh: This is a summary
      "
    `);

    expect(getChangelog("pkg-b", spy.mock.calls)).toMatchInlineSnapshot(`
      "# pkg-b

      ## 1.0.1

      ### Patch Changes

      - g1th4sh: This is some fix
      "
    `);
  });
});

describe("pre", () => {
  it("should work", async () => {
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
    await pre(cwd, { command: "enter", tag: "next" });
    await writeChangeset(
      {
        releases: [{ name: "pkg-b", type: "patch" }],
        summary: "a very useful summary for the first change",
      },
      cwd
    );
    await version(cwd, defaultOptions, modifiedDefaultConfig);
    let packages = (await getPackages(cwd))!;
    expect(packages.packages.map((x) => x.packageJson)).toEqual([
      {
        dependencies: {
          "pkg-b": "1.0.1-next.0",
        },
        name: "pkg-a",
        version: "1.0.1-next.0",
      },
      {
        name: "pkg-b",
        version: "1.0.1-next.0",
      },
    ]);
    await writeChangeset(
      {
        releases: [{ name: "pkg-a", type: "patch" }],
        summary: "a very useful summary",
      },
      cwd
    );

    await version(cwd, defaultOptions, modifiedDefaultConfig);
    packages = (await getPackages(cwd))!;
    expect(packages.packages.map((x) => x.packageJson)).toEqual([
      {
        dependencies: {
          "pkg-b": "1.0.1-next.0",
        },
        name: "pkg-a",
        version: "1.0.1-next.1",
      },
      {
        name: "pkg-b",
        version: "1.0.1-next.0",
      },
    ]);
    await writeChangeset(
      {
        releases: [{ name: "pkg-a", type: "patch" }],
        summary: "a very useful summary for the second change",
      },
      cwd
    );
    await version(cwd, defaultOptions, modifiedDefaultConfig);
    packages = (await getPackages(cwd))!;
    expect(packages.packages.map((x) => x.packageJson)).toEqual([
      {
        dependencies: {
          "pkg-b": "1.0.1-next.0",
        },
        name: "pkg-a",
        version: "1.0.1-next.2",
      },
      {
        name: "pkg-b",
        version: "1.0.1-next.0",
      },
    ]);
    await writeChangeset(
      {
        releases: [{ name: "pkg-a", type: "minor" }],
        summary: "a very useful summary for the third change",
      },
      cwd
    );
    await version(cwd, defaultOptions, modifiedDefaultConfig);
    packages = (await getPackages(cwd))!;
    expect(packages.packages.map((x) => x.packageJson)).toMatchInlineSnapshot(`
      [
        {
          "dependencies": {
            "pkg-b": "1.0.1-next.0",
          },
          "name": "pkg-a",
          "version": "1.1.0-next.3",
        },
        {
          "name": "pkg-b",
          "version": "1.0.1-next.0",
        },
      ]
    `);
    await pre(cwd, { command: "exit" });
    await version(cwd, defaultOptions, modifiedDefaultConfig);
    packages = (await getPackages(cwd))!;
    expect(packages.packages.map((x) => x.packageJson)).toEqual([
      {
        dependencies: {
          "pkg-b": "1.0.1",
        },
        name: "pkg-a",
        version: "1.1.0",
      },
      {
        name: "pkg-b",
        version: "1.0.1",
      },
    ]);
    expect(
      await fs.readFile(
        path.join(packages.packages[0].dir, "CHANGELOG.md"),
        "utf8"
      )
    ).toMatchInlineSnapshot(`
      "# pkg-a

      ## 1.1.0

      ### Minor Changes

      - g1th4sh: a very useful summary for the third change

      ### Patch Changes

      - g1th4sh: a very useful summary
      - g1th4sh: a very useful summary for the second change
      - Updated dependencies [g1th4sh]
        - pkg-b@1.0.1

      ## 1.1.0-next.3

      ### Minor Changes

      - g1th4sh: a very useful summary for the third change

      ## 1.0.1-next.2

      ### Patch Changes

      - g1th4sh: a very useful summary for the second change

      ## 1.0.1-next.1

      ### Patch Changes

      - g1th4sh: a very useful summary

      ## 1.0.1-next.0

      ### Patch Changes

      - Updated dependencies [g1th4sh]
        - pkg-b@1.0.1-next.0
      "
    `);
    expect(
      await fs.readFile(
        path.join(packages.packages[1].dir, "CHANGELOG.md"),
        "utf8"
      )
    ).toMatchInlineSnapshot(`
      "# pkg-b

      ## 1.0.1

      ### Patch Changes

      - g1th4sh: a very useful summary for the first change

      ## 1.0.1-next.0

      ### Patch Changes

      - g1th4sh: a very useful summary for the first change
      "
    `);
  });
  it("should work with adding a package while in pre mode", async () => {
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
    await pre(cwd, { command: "enter", tag: "next" });
    await writeChangeset(
      {
        releases: [{ name: "pkg-b", type: "patch" }],
        summary: "a very useful summary for the first change",
      },
      cwd
    );

    await version(cwd, defaultOptions, modifiedDefaultConfig);
    let packages = (await getPackages(cwd))!;
    expect(packages.packages.map((x) => x.packageJson)).toEqual([
      {
        dependencies: {
          "pkg-b": "1.0.1-next.0",
        },
        name: "pkg-a",
        version: "1.0.1-next.0",
      },
      {
        name: "pkg-b",
        version: "1.0.1-next.0",
      },
    ]);
    await fs.mkdir(path.join(cwd, "packages", "pkg-c"));
    await fs.writeJson(path.join(cwd, "packages", "pkg-c", "package.json"), {
      name: "pkg-c",
      version: "0.0.0",
    });
    await writeChangeset(
      {
        releases: [
          { name: "pkg-b", type: "major" },
          { name: "pkg-c", type: "patch" },
        ],
        summary: "a very useful summary for the first change",
      },
      cwd
    );
    await version(cwd, defaultOptions, modifiedDefaultConfig);
    packages = (await getPackages(cwd))!;

    expect(packages.packages.map((x) => x.packageJson)).toEqual([
      {
        dependencies: {
          "pkg-b": "2.0.0-next.1",
        },
        name: "pkg-a",
        version: "1.0.1-next.1",
      },
      {
        name: "pkg-b",
        version: "2.0.0-next.1",
      },
      {
        name: "pkg-c",
        version: "0.0.1-next.0",
      },
    ]);
  });
  it("should work for my weird case", async () => {
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
    await writeChangeset(
      {
        releases: [{ name: "pkg-a", type: "minor" }],
        summary: "a very useful summary for the first change",
      },
      cwd
    );
    await version(cwd, defaultOptions, modifiedDefaultConfig);
    let packages = (await getPackages(cwd))!;

    expect(packages.packages.map((x) => x.packageJson)).toEqual([
      {
        dependencies: { "pkg-b": "1.0.0" },
        name: "pkg-a",
        version: "1.1.0",
      },
      {
        name: "pkg-b",
        version: "1.0.0",
      },
    ]);

    await pre(cwd, { command: "enter", tag: "next" });
    await writeChangeset(
      {
        releases: [{ name: "pkg-a", type: "patch" }],
        summary: "a very useful summary for the first change",
      },
      cwd
    );
    await version(cwd, defaultOptions, modifiedDefaultConfig);
    packages = (await getPackages(cwd))!;

    expect(packages.packages.map((x) => x.packageJson)).toEqual([
      {
        dependencies: { "pkg-b": "1.0.0" },
        name: "pkg-a",
        version: "1.1.1-next.0",
      },
      {
        name: "pkg-b",
        version: "1.0.0",
      },
    ]);
  });
  // https://github.com/changesets/changesets/pull/382#discussion_r434434182
  it("should bump patch version for packages that had prereleases, but caret dependencies are still in range", async () => {
    let cwd = await testdir({
      "package.json": JSON.stringify({
        private: true,
        workspaces: ["packages/*"],
      }),
      "packages/pkg-a/package.json": JSON.stringify({
        name: "pkg-a",
        version: "1.0.0",
        dependencies: {
          "pkg-b": "^1.0.0",
        },
      }),
      "packages/pkg-b/package.json": JSON.stringify({
        name: "pkg-b",
        version: "1.0.0",
      }),
    });
    await pre(cwd, { command: "enter", tag: "next" });
    await writeChangeset(
      {
        releases: [{ name: "pkg-b", type: "patch" }],
        summary: "a very useful summary for the first change",
      },
      cwd
    );
    await version(cwd, defaultOptions, modifiedDefaultConfig);

    let packages = (await getPackages(cwd))!;
    expect(packages.packages.map((x) => x.packageJson)).toEqual([
      {
        dependencies: {
          "pkg-b": "^1.0.1-next.0",
        },
        name: "pkg-a",
        version: "1.0.1-next.0",
      },
      {
        name: "pkg-b",
        version: "1.0.1-next.0",
      },
    ]);

    await pre(cwd, { command: "exit" });
    await version(cwd, defaultOptions, modifiedDefaultConfig);

    packages = (await getPackages(cwd))!;
    expect(packages.packages.map((x) => x.packageJson)).toEqual([
      {
        dependencies: {
          "pkg-b": "^1.0.1",
        },
        name: "pkg-a",
        version: "1.0.1",
      },
      {
        name: "pkg-b",
        version: "1.0.1",
      },
    ]);
  });

  it("should use the highest bump type between all prereleases when versioning a package", async () => {
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
    await writeChangeset(
      {
        releases: [{ name: "pkg-a", type: "major" }],
        summary: "a very useful summary for the first change",
      },
      cwd
    );

    await pre(cwd, { command: "enter", tag: "next" });
    await version(cwd, defaultOptions, modifiedDefaultConfig);
    let packages = (await getPackages(cwd))!;

    expect(packages.packages.map((x) => x.packageJson)).toEqual([
      {
        dependencies: { "pkg-b": "1.0.0" },
        name: "pkg-a",
        version: "2.0.0-next.0",
      },
      {
        name: "pkg-b",
        version: "1.0.0",
      },
    ]);

    await writeChangeset(
      {
        releases: [{ name: "pkg-a", type: "minor" }],
        summary: "a very useful summary for the second change",
      },
      cwd
    );
    await version(cwd, defaultOptions, modifiedDefaultConfig);
    packages = (await getPackages(cwd))!;

    expect(packages.packages.map((x) => x.packageJson)).toEqual([
      {
        dependencies: { "pkg-b": "1.0.0" },
        name: "pkg-a",
        version: "2.0.0-next.1",
      },
      {
        name: "pkg-b",
        version: "1.0.0",
      },
    ]);
  });
  it("should use the highest bump type between all prereleases when versioning a dependent package", async () => {
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
    await pre(cwd, { command: "enter", tag: "next" });

    await writeChangeset(
      {
        releases: [{ name: "pkg-a", type: "major" }],
        summary: "a very useful summary for the first change",
      },
      cwd
    );

    await version(cwd, defaultOptions, modifiedDefaultConfig);
    let packages = (await getPackages(cwd))!;

    expect(packages.packages.map((x) => x.packageJson)).toEqual([
      {
        dependencies: { "pkg-b": "1.0.0" },
        name: "pkg-a",
        version: "2.0.0-next.0",
      },
      {
        name: "pkg-b",
        version: "1.0.0",
      },
    ]);

    await writeChangeset(
      {
        releases: [{ name: "pkg-b", type: "minor" }],
        summary: "a very useful summary for the second change",
      },
      cwd
    );
    await version(cwd, defaultOptions, modifiedDefaultConfig);
    packages = (await getPackages(cwd))!;

    expect(packages.packages.map((x) => x.packageJson)).toEqual([
      {
        name: "pkg-a",
        version: "2.0.0-next.1",
        dependencies: { "pkg-b": "1.1.0-next.0" },
      },
      {
        name: "pkg-b",
        version: "1.1.0-next.0",
      },
    ]);
  });

  it("should not bump packages through devDependencies", async () => {
    let cwd = await testdir({
      "package.json": JSON.stringify({
        private: true,
        workspaces: ["packages/*"],
      }),
      "packages/pkg-a/package.json": JSON.stringify({
        name: "pkg-a",
        version: "1.0.0",
        devDependencies: {
          "pkg-b": "1.0.0",
        },
      }),
      "packages/pkg-b/package.json": JSON.stringify({
        name: "pkg-b",
        version: "1.0.0",
      }),
    });
    await writeChangeset(
      {
        releases: [{ name: "pkg-b", type: "major" }],
        summary: "a very useful summary for the first change",
      },
      cwd
    );

    await pre(cwd, { command: "enter", tag: "next" });
    await version(cwd, defaultOptions, modifiedDefaultConfig);
    let packages = (await getPackages(cwd))!;

    expect(packages.packages.map((x) => x.packageJson)).toEqual([
      {
        devDependencies: { "pkg-b": "2.0.0-next.0" },
        name: "pkg-a",
        version: "1.0.0",
      },
      {
        name: "pkg-b",
        version: "2.0.0-next.0",
      },
    ]);
  });
  it("should not bump ignored packages through dependencies", async () => {
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
    await writeChangeset(
      {
        releases: [{ name: "pkg-a", type: "major" }],
        summary: "a very useful summary for the first change",
      },
      cwd
    );

    await writeChangeset(
      {
        releases: [{ name: "pkg-b", type: "major" }],
        summary: "a very useful summary for the first change",
      },
      cwd
    );

    await pre(cwd, { command: "enter", tag: "next" });
    await version(cwd, defaultOptions, {
      ...modifiedDefaultConfig,
      ignore: ["pkg-a"],
    });
    let packages = (await getPackages(cwd))!;

    expect(packages.packages.map((x) => x.packageJson)).toEqual([
      {
        dependencies: { "pkg-b": "2.0.0-next.0" },
        name: "pkg-a",
        version: "1.0.0",
      },
      {
        name: "pkg-b",
        version: "2.0.0-next.0",
      },
    ]);
  });
  it("should bump dependent of prerelease package when bumping a `workspace:~` dependency", async () => {
    const cwd = await testdir({
      "package.json": JSON.stringify({
        private: true,
        workspaces: ["packages/*"],
      }),
      "packages/pkg-a/package.json": JSON.stringify({
        name: "pkg-a",
        version: "1.0.0",
        dependencies: {
          "pkg-b": "workspace:~",
        },
      }),
      "packages/pkg-b/package.json": JSON.stringify({
        name: "pkg-b",
        version: "1.0.0",
      }),
    });
    await pre(cwd, { command: "enter", tag: "alpha" });

    await writeChangeset(
      {
        releases: [{ name: "pkg-b", type: "patch" }],
        summary: "a very useful summary for the change",
      },
      cwd
    );
    await version(cwd, defaultOptions, modifiedDefaultConfig);

    let packages = await getPackages(cwd);
    expect(packages.packages.map((x) => x.packageJson)).toEqual([
      {
        name: "pkg-a",
        version: "1.0.1-alpha.0",
        dependencies: {
          "pkg-b": "workspace:~",
        },
      },
      {
        name: "pkg-b",
        version: "1.0.1-alpha.0",
      },
    ]);
  });

  it("should replace star range for dependency in dependant package when that dependency has its first prerelease in an already active pre mode", async () => {
    const cwd = await testdir({
      "package.json": JSON.stringify({
        private: true,
        workspaces: ["packages/*"],
      }),
      "packages/pkg-a/package.json": JSON.stringify({
        name: "pkg-a",
        version: "1.0.0",
        dependencies: {
          "pkg-b": "*",
        },
      }),
      "packages/pkg-b/package.json": JSON.stringify({
        name: "pkg-b",
        version: "1.0.0",
      }),
    });

    await pre(cwd, { command: "enter", tag: "alpha" });

    await writeChangeset(
      {
        releases: [{ name: "pkg-a", type: "patch" }],
        summary: "a very useful summary for the change",
      },
      cwd
    );

    await version(cwd, defaultOptions, modifiedDefaultConfig);

    expect((await getPackages(cwd)).packages.map((x) => x.packageJson))
      .toMatchInlineSnapshot(`
      [
        {
          "dependencies": {
            "pkg-b": "*",
          },
          "name": "pkg-a",
          "version": "1.0.1-alpha.0",
        },
        {
          "name": "pkg-b",
          "version": "1.0.0",
        },
      ]
    `);

    await writeChangeset(
      {
        releases: [{ name: "pkg-b", type: "patch" }],
        summary: "a very useful summary for the change",
      },
      cwd
    );

    await version(cwd, defaultOptions, modifiedDefaultConfig);

    expect((await getPackages(cwd)).packages.map((x) => x.packageJson))
      .toMatchInlineSnapshot(`
      [
        {
          "dependencies": {
            "pkg-b": "1.0.1-alpha.0",
          },
          "name": "pkg-a",
          "version": "1.0.1-alpha.1",
        },
        {
          "name": "pkg-b",
          "version": "1.0.1-alpha.0",
        },
      ]
    `);
  });

  it("bumping dependency in pre mode should result in dependant with star range on that dependency to be patch bumped and that range to be replaced with exact version", async () => {
    const cwd = await testdir({
      "package.json": JSON.stringify({
        private: true,
        workspaces: ["packages/*"],
      }),
      "packages/pkg-a/package.json": JSON.stringify({
        name: "pkg-a",
        version: "1.0.0",
        dependencies: {
          "pkg-b": "*",
        },
      }),
      "packages/pkg-b/package.json": JSON.stringify({
        name: "pkg-b",
        version: "1.0.0",
      }),
    });

    await pre(cwd, { command: "enter", tag: "alpha" });

    await writeChangeset(
      {
        releases: [{ name: "pkg-b", type: "patch" }],
        summary: "a very useful summary for the change",
      },
      cwd
    );

    await version(cwd, defaultOptions, modifiedDefaultConfig);

    expect((await getPackages(cwd)).packages.map((x) => x.packageJson))
      .toMatchInlineSnapshot(`
      [
        {
          "dependencies": {
            "pkg-b": "1.0.1-alpha.0",
          },
          "name": "pkg-a",
          "version": "1.0.1-alpha.0",
        },
        {
          "name": "pkg-b",
          "version": "1.0.1-alpha.0",
        },
      ]
    `);
  });

  it("bumping dependency in pre mode should result in dependant with workspace:* range on that dependency to be patch bumped without changing the dependency range", async () => {
    const cwd = await testdir({
      "package.json": JSON.stringify({
        private: true,
        workspaces: ["packages/*"],
      }),
      "packages/pkg-a/package.json": JSON.stringify({
        name: "pkg-a",
        version: "1.0.0",
        dependencies: {
          "pkg-b": "workspace:*",
        },
      }),
      "packages/pkg-b/package.json": JSON.stringify({
        name: "pkg-b",
        version: "1.0.0",
      }),
    });

    await pre(cwd, { command: "enter", tag: "alpha" });

    await writeChangeset(
      {
        releases: [{ name: "pkg-b", type: "patch" }],
        summary: "a very useful summary for the change",
      },
      cwd
    );

    await version(cwd, defaultOptions, modifiedDefaultConfig);

    expect((await getPackages(cwd)).packages.map((x) => x.packageJson))
      .toMatchInlineSnapshot(`
      [
        {
          "dependencies": {
            "pkg-b": "workspace:*",
          },
          "name": "pkg-a",
          "version": "1.0.1-alpha.0",
        },
        {
          "name": "pkg-b",
          "version": "1.0.1-alpha.0",
        },
      ]
    `);
  });

  it("bumping dependency in pre mode should result in dependant with workspace:^ range on that dependency to be patch bumped without changing the dependency range", async () => {
    const cwd = await testdir({
      "package.json": JSON.stringify({
        private: true,
        workspaces: ["packages/*"],
      }),
      "packages/pkg-a/package.json": JSON.stringify({
        name: "pkg-a",
        version: "1.0.0",
        dependencies: {
          "pkg-b": "workspace:^",
        },
      }),
      "packages/pkg-b/package.json": JSON.stringify({
        name: "pkg-b",
        version: "1.0.0",
      }),
    });

    await pre(cwd, { command: "enter", tag: "alpha" });

    await writeChangeset(
      {
        releases: [{ name: "pkg-b", type: "patch" }],
        summary: "a very useful summary for the change",
      },
      cwd
    );

    await version(cwd, defaultOptions, modifiedDefaultConfig);

    expect((await getPackages(cwd)).packages.map((x) => x.packageJson))
      .toMatchInlineSnapshot(`
      [
        {
          "dependencies": {
            "pkg-b": "workspace:^",
          },
          "name": "pkg-a",
          "version": "1.0.1-alpha.0",
        },
        {
          "name": "pkg-b",
          "version": "1.0.1-alpha.0",
        },
      ]
    `);
  });

  it("bumping dependency in pre mode should result in dependant with workspace:~ range on that dependency to be patch bumped without changing the dependency range", async () => {
    const cwd = await testdir({
      "package.json": JSON.stringify({
        private: true,
        workspaces: ["packages/*"],
      }),
      "packages/pkg-a/package.json": JSON.stringify({
        name: "pkg-a",
        version: "1.0.0",
        dependencies: {
          "pkg-b": "workspace:~",
        },
      }),
      "packages/pkg-b/package.json": JSON.stringify({
        name: "pkg-b",
        version: "1.0.0",
      }),
    });

    await pre(cwd, { command: "enter", tag: "alpha" });

    await writeChangeset(
      {
        releases: [{ name: "pkg-b", type: "patch" }],
        summary: "a very useful summary for the change",
      },
      cwd
    );

    await version(cwd, defaultOptions, modifiedDefaultConfig);

    expect((await getPackages(cwd)).packages.map((x) => x.packageJson))
      .toMatchInlineSnapshot(`
      [
        {
          "dependencies": {
            "pkg-b": "workspace:~",
          },
          "name": "pkg-a",
          "version": "1.0.1-alpha.0",
        },
        {
          "name": "pkg-b",
          "version": "1.0.1-alpha.0",
        },
      ]
    `);
  });

  describe("linked", () => {
    it("should work with linked", async () => {
      let linkedConfig = {
        ...modifiedDefaultConfig,
        linked: [["pkg-a", "pkg-b"]],
      };
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
      await writeChangeset(
        {
          releases: [{ name: "pkg-a", type: "minor" }],
          summary: "a very useful summary",
        },
        cwd
      );
      await version(cwd, defaultOptions, linkedConfig);
      let packages = (await getPackages(cwd))!;

      expect(packages.packages.map((x) => x.packageJson)).toEqual([
        {
          dependencies: { "pkg-b": "1.0.0" },
          name: "pkg-a",
          version: "1.1.0",
        },
        {
          name: "pkg-b",
          version: "1.0.0",
        },
      ]);

      await pre(cwd, { command: "enter", tag: "next" });
      await writeChangeset(
        {
          releases: [{ name: "pkg-b", type: "patch" }],
          summary: "a very useful summary",
        },
        cwd
      );
      await version(cwd, defaultOptions, linkedConfig);
      packages = (await getPackages(cwd))!;

      expect(packages.packages.map((x) => x.packageJson)).toEqual([
        {
          dependencies: { "pkg-b": "1.1.1-next.0" },
          name: "pkg-a",
          version: "1.1.1-next.0",
        },
        {
          name: "pkg-b",
          version: "1.1.1-next.0",
        },
      ]);
      await writeChangeset(
        {
          releases: [{ name: "pkg-a", type: "patch" }],
          summary: "a very useful summary",
        },
        cwd
      );
      await version(cwd, defaultOptions, linkedConfig);
      packages = (await getPackages(cwd))!;
      expect(packages.packages.map((x) => x.packageJson)).toEqual([
        {
          dependencies: { "pkg-b": "1.1.1-next.0" },
          name: "pkg-a",
          version: "1.1.1-next.1",
        },
        {
          name: "pkg-b",
          version: "1.1.1-next.0",
        },
      ]);
      await writeChangeset(
        {
          releases: [{ name: "pkg-a", type: "patch" }],
          summary: "a very useful summary",
        },
        cwd
      );
      await version(cwd, defaultOptions, linkedConfig);
      packages = (await getPackages(cwd))!;
      expect(packages.packages.map((x) => x.packageJson)).toEqual([
        {
          dependencies: { "pkg-b": "1.1.1-next.0" },
          name: "pkg-a",
          version: "1.1.1-next.2",
        },
        {
          name: "pkg-b",
          version: "1.1.1-next.0",
        },
      ]);
    });

    it("should use the highest bump type between all prereleases for a linked package when versioning a dependent package", async () => {
      let linkedConfig = {
        ...modifiedDefaultConfig,
        linked: [["pkg-a", "pkg-b"]],
      };
      let cwd = await testdir({
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
          dependencies: {
            "pkg-c": "0.1.0",
          },
        }),
        "packages/pkg-c/package.json": JSON.stringify({
          name: "pkg-c",
          version: "0.1.0",
        }),
      });
      await pre(cwd, { command: "enter", tag: "next" });
      await writeChangeset(
        {
          releases: [{ name: "pkg-a", type: "minor" }],
          summary: "a very useful summary",
        },
        cwd
      );
      await version(cwd, defaultOptions, linkedConfig);
      let packages = (await getPackages(cwd))!;

      expect(packages.packages.map((x) => x.packageJson)).toEqual([
        {
          name: "pkg-a",
          version: "1.1.0-next.0",
        },
        {
          name: "pkg-b",
          version: "1.0.0",
          dependencies: { "pkg-c": "0.1.0" },
        },
        {
          name: "pkg-c",
          version: "0.1.0",
        },
      ]);

      await writeChangeset(
        {
          releases: [{ name: "pkg-c", type: "patch" }],
          summary: "a very useful summary",
        },
        cwd
      );
      await version(cwd, defaultOptions, linkedConfig);
      packages = (await getPackages(cwd))!;

      expect(packages.packages.map((x) => x.packageJson)).toEqual([
        {
          name: "pkg-a",
          version: "1.1.0-next.0",
        },
        {
          name: "pkg-b",
          version: "1.1.0-next.1",
          dependencies: { "pkg-c": "0.1.1-next.0" },
        },
        {
          name: "pkg-c",
          version: "0.1.1-next.0",
        },
      ]);
    });
    it("should not bump a linked package if its linked devDep gets released", async () => {
      let linkedConfig = {
        ...modifiedDefaultConfig,
        linked: [["pkg-a", "pkg-b"]],
      };
      let cwd = await testdir({
        "package.json": JSON.stringify({
          private: true,
          workspaces: ["packages/*"],
        }),
        "packages/pkg-a/package.json": JSON.stringify({
          name: "pkg-a",
          version: "1.0.0",
          devDependencies: {
            "pkg-b": "1.0.0",
          },
        }),
        "packages/pkg-b/package.json": JSON.stringify({
          name: "pkg-b",
          version: "1.0.0",
        }),
      });
      await writeChangeset(
        {
          releases: [{ name: "pkg-b", type: "patch" }],
          summary: "a very useful summary",
        },
        cwd
      );
      await version(cwd, defaultOptions, linkedConfig);
      let packages = (await getPackages(cwd))!;

      expect(packages.packages.map((x) => x.packageJson)).toEqual([
        {
          name: "pkg-a",
          version: "1.0.0",
          devDependencies: { "pkg-b": "1.0.1" },
        },
        {
          name: "pkg-b",
          version: "1.0.1",
        },
      ]);
    });
  });
});

describe("with privatePackages", () => {
  silenceLogsInBlock();

  it("should skip private packages", async () => {
    const cwd = await testdir({
      "package.json": JSON.stringify({
        private: true,
        workspaces: ["packages/*"],
      }),
      "packages/pkg-a/package.json": JSON.stringify({
        name: "pkg-a",
        version: "1.0.0",
        private: true,
        dependencies: {
          "pkg-b": "1.0.0",
        },
      }),
      "packages/pkg-b/package.json": JSON.stringify({
        name: "pkg-b",
        version: "1.0.0",
      }),
      ".changeset/changesets-are-beautiful.md": `---
"pkg-b": minor
---

Nice simple summary, much wow
`,
    });

    await version(cwd, defaultOptions, {
      ...modifiedDefaultConfig,
      privatePackages: {
        version: false,
        tag: false,
      },
    });

    let packages = await getPackages(cwd);
    expect(packages.packages.map((x) => x.packageJson)).toEqual([
      {
        name: "pkg-a",
        version: "1.0.0",
        private: true,
        dependencies: {
          "pkg-b": "1.1.0",
        },
      },
      {
        name: "pkg-b",
        version: "1.1.0",
      },
    ]);
  });
});
