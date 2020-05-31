import fixtures from "fixturez";

import fs from "fs-extra";
import path from "path";
import versionCommand from "./index";
import * as git from "@changesets/git";
import { warn } from "@changesets/logger";
import { temporarilySilenceLogs } from "@changesets/test-utils";
import writeChangeset from "@changesets/write";
import { NewChangeset, Config } from "@changesets/types";
import { defaultConfig } from "@changesets/config";
import { getPackages } from "@manypkg/get-packages";
import pre from "../pre";
import version from "./index";
import humanId from "human-id";

const f = fixtures(__dirname);

let changelogPath = path.resolve(__dirname, "../../changelog");
let modifiedDefaultConfig: Config = {
  ...defaultConfig,
  changelog: [changelogPath, null]
};

let defaultOptions = {
  snapshot: undefined
};

beforeEach(() => {
  let i = 0;
  (humanId as jest.Mock<string, []>).mockImplementation(() => {
    return `some-id-${i++}`;
  });
});

// avoid polluting test logs with error message in console
// This is from bolt's error log
const consoleError = console.error;

jest.mock("../../utils/cli-utilities");
jest.mock("@changesets/git");
jest.mock("human-id");
jest.mock("@changesets/logger");

// @ts-ignore
git.add.mockImplementation(() => Promise.resolve(true));
// @ts-ignore
git.commit.mockImplementation(() => Promise.resolve(true));
// @ts-ignore
git.tag.mockImplementation(() => Promise.resolve(true));

const simpleChangeset: NewChangeset = {
  summary: "This is a summary",
  releases: [{ name: "pkg-a", type: "minor" }],
  id: "having-lotsof-fun"
};

const simpleChangeset2: NewChangeset = {
  summary: "This is a summary too",
  releases: [
    { name: "pkg-a", type: "minor" },
    { name: "pkg-b", type: "patch" }
  ],
  id: "wouldnit-be-nice"
};

const simpleChangeset3: NewChangeset = {
  summary: "This is not a summary",
  releases: [{ name: "pkg-b", type: "patch" }],
  id: "hot-day-today"
};

const writeChangesets = (changesets: NewChangeset[], cwd: string) => {
  return Promise.all(
    changesets.map(changeset => writeChangeset(changeset, cwd))
  );
};

const getPkgJSON = (pkgName: string, calls: any) => {
  let castCalls: [string, string][] = calls;
  const foundCall = castCalls.find(call =>
    call[0].endsWith(`${pkgName}${path.sep}package.json`)
  );
  if (!foundCall)
    throw new Error(`could not find writing of package.json: ${pkgName}`);

  return JSON.parse(foundCall[1]);
};

const writeEmptyChangeset = (cwd: string) => writeChangesets([], cwd);

describe("running version in a simple project", () => {
  temporarilySilenceLogs();
  let cwd: string;

  beforeEach(async () => {
    cwd = await f.copy("simple-project");
    console.error = jest.fn();
  });

  afterEach(async () => {
    console.error = consoleError;
  });

  describe("when there are no changeset commits", () => {
    it("should warn if no changeset commits exist", async () => {
      await writeEmptyChangeset(cwd);
      await versionCommand(cwd, defaultOptions, modifiedDefaultConfig);
      // @ts-ignore
      const loggerWarnCalls = warn.mock.calls;
      expect(loggerWarnCalls.length).toEqual(1);
      expect(loggerWarnCalls[0][0]).toEqual(
        "No unreleased changesets found, exiting."
      );
    });
  });

  describe("When there is a changeset commit", () => {
    it("should bump releasedPackages", async () => {
      await writeChangesets([simpleChangeset2], cwd);
      const spy = jest.spyOn(fs, "writeFile");

      await versionCommand(cwd, defaultOptions, modifiedDefaultConfig);

      expect(getPkgJSON("pkg-a", spy.mock.calls)).toEqual(
        expect.objectContaining({ name: "pkg-a", version: "1.1.0" })
      );
      expect(getPkgJSON("pkg-b", spy.mock.calls)).toEqual(
        expect.objectContaining({ name: "pkg-b", version: "1.0.1" })
      );
    });
  });

  it("should bump packages to the correct versions when packages are linked", async () => {
    const cwd2 = await f.copy("linked-packages");
    await writeChangesets([simpleChangeset2], cwd2);
    const spy = jest.spyOn(fs, "writeFile");

    await versionCommand(cwd2, defaultOptions, {
      ...modifiedDefaultConfig,
      linked: [["pkg-a", "pkg-b"]]
    });

    expect(getPkgJSON("pkg-a", spy.mock.calls)).toEqual(
      expect.objectContaining({ name: "pkg-a", version: "1.1.0" })
    );
    expect(getPkgJSON("pkg-b", spy.mock.calls)).toEqual(
      expect.objectContaining({ name: "pkg-b", version: "1.1.0" })
    );
  });

  it("should not break when there is a linked package without a changeset", async () => {
    const cwd2 = await f.copy("linked-packages");
    await writeChangesets([simpleChangeset], cwd2);
    const spy = jest.spyOn(fs, "writeFile");

    await versionCommand(cwd2, defaultOptions, modifiedDefaultConfig);

    expect(getPkgJSON("pkg-a", spy.mock.calls)).toEqual(
      expect.objectContaining({ name: "pkg-a", version: "1.1.0" })
    );
  });

  it("should not touch package.json of an ignored package when it is not a dependent of any releasedPackages ", async () => {
    await writeChangesets([simpleChangeset], cwd);
    const spy = jest.spyOn(fs, "writeFile");

    await versionCommand(cwd, defaultOptions, {
      ...modifiedDefaultConfig,
      ignore: ["pkg-a"]
    });

    const bumpedPackageA = !!spy.mock.calls.find((call: string[]) =>
      call[0].endsWith(`pkg-a${path.sep}package.json`)
    );

    expect(bumpedPackageA).toBe(false);
  });

  it("should not bump ignored packages", async () => {
    await writeChangesets([simpleChangeset, simpleChangeset3], cwd);
    const spy = jest.spyOn(fs, "writeFile");

    await versionCommand(cwd, defaultOptions, {
      ...modifiedDefaultConfig,
      ignore: ["pkg-a"]
    });

    expect(getPkgJSON("pkg-b", spy.mock.calls)).toEqual(
      expect.objectContaining({ name: "pkg-b", version: "1.0.1" })
    );
    expect(getPkgJSON("pkg-a", spy.mock.calls)).toEqual(
      expect.objectContaining({ name: "pkg-a", version: "1.0.0" })
    );
  });

  describe("when there are multiple changeset commits", () => {
    it("should bump releasedPackages", async () => {
      await writeChangesets([simpleChangeset, simpleChangeset2], cwd);
      const spy = jest.spyOn(fs, "writeFile");

      await versionCommand(cwd, defaultOptions, modifiedDefaultConfig);

      expect(getPkgJSON("pkg-a", spy.mock.calls)).toEqual(
        expect.objectContaining({ name: "pkg-a", version: "1.1.0" })
      );
      expect(getPkgJSON("pkg-b", spy.mock.calls)).toEqual(
        expect.objectContaining({ name: "pkg-b", version: "1.0.1" })
      );
    });

    it("should bump multiple released packages if required", async () => {
      await writeChangesets([simpleChangeset, simpleChangeset2], cwd);
      const spy = jest.spyOn(fs, "writeFile");
      await versionCommand(cwd, defaultOptions, modifiedDefaultConfig);

      // first call should be minor bump
      expect(getPkgJSON("pkg-a", spy.mock.calls)).toEqual(
        expect.objectContaining({
          name: "pkg-a",
          version: "1.1.0"
        })
      );
      // second should be a patch
      expect(getPkgJSON("pkg-b", spy.mock.calls)).toEqual(
        expect.objectContaining({
          name: "pkg-b",
          version: "1.0.1"
        })
      );
    });
    it("should delete the changeset files", async () => {
      await writeChangesets([simpleChangeset, simpleChangeset2], cwd);
      await versionCommand(cwd, defaultOptions, modifiedDefaultConfig);

      const dirs = await fs.readdir(path.resolve(cwd, ".changeset"));
      expect(dirs.length).toBe(2);
    });
  });
});

describe("running version in a simple project with workspace range", () => {
  temporarilySilenceLogs();
  let cwd: string;

  beforeEach(async () => {
    cwd = await f.copy("simple-workspace-range-dep");
    console.error = jest.fn();
  });

  afterEach(async () => {
    console.error = consoleError;
  });

  describe("When there is a changeset commit", () => {
    it("should bump releasedPackages", async () => {
      await writeChangesets([simpleChangeset2], cwd);
      const spy = jest.spyOn(fs, "writeFile");

      await versionCommand(cwd, defaultOptions, modifiedDefaultConfig);

      expect(getPkgJSON("pkg-a", spy.mock.calls)).toEqual(
        expect.objectContaining({
          name: "pkg-a",
          version: "1.1.0",
          dependencies: { "pkg-b": "workspace:1.0.1" }
        })
      );
      expect(getPkgJSON("pkg-b", spy.mock.calls)).toEqual(
        expect.objectContaining({ name: "pkg-b", version: "1.0.1" })
      );
    });
  });
});

describe("snapshot release", () => {
  it("should update the packge to unique version no matter the kind of version bump it is", async () => {
    let cwd = f.copy("simple-project");
    await writeChangesets([simpleChangeset2], cwd);
    const spy = jest.spyOn(fs, "writeFile");
    await versionCommand(
      cwd,
      {
        snapshot: "exprimental"
      },
      {
        ...modifiedDefaultConfig,
        commit: false
      }
    );
    expect(getPkgJSON("pkg-a", spy.mock.calls)).toEqual(
      expect.objectContaining({
        name: "pkg-a",
        version: expect.stringContaining("0.0.0-exprimental-")
      })
    );

    expect(getPkgJSON("pkg-b", spy.mock.calls)).toEqual(
      expect.objectContaining({
        name: "pkg-b",
        version: expect.stringContaining("0.0.0-exprimental-")
      })
    );
  });
});

describe("pre", () => {
  it("should work", async () => {
    let cwd = f.copy("simple-project");
    await pre(cwd, { command: "enter", tag: "next" });
    await writeChangeset(
      {
        releases: [{ name: "pkg-b", type: "patch" }],
        summary: "a very useful summary for the first change"
      },
      cwd
    );
    await version(cwd, defaultOptions, modifiedDefaultConfig);
    let packages = (await getPackages(cwd))!;
    expect(packages.packages.map(x => x.packageJson)).toEqual([
      {
        dependencies: {
          "pkg-b": "1.0.1-next.0"
        },
        name: "pkg-a",
        version: "1.0.1-next.0"
      },
      {
        name: "pkg-b",
        version: "1.0.1-next.0"
      }
    ]);
    await writeChangeset(
      {
        releases: [{ name: "pkg-a", type: "patch" }],
        summary: "a very useful summary"
      },
      cwd
    );

    await version(cwd, defaultOptions, modifiedDefaultConfig);
    packages = (await getPackages(cwd))!;
    expect(packages.packages.map(x => x.packageJson)).toEqual([
      {
        dependencies: {
          "pkg-b": "1.0.1-next.0"
        },
        name: "pkg-a",
        version: "1.0.1-next.1"
      },
      {
        name: "pkg-b",
        version: "1.0.1-next.0"
      }
    ]);
    await writeChangeset(
      {
        releases: [{ name: "pkg-a", type: "patch" }],
        summary: "a very useful summary for the second change"
      },
      cwd
    );
    await version(cwd, defaultOptions, modifiedDefaultConfig);
    packages = (await getPackages(cwd))!;
    expect(packages.packages.map(x => x.packageJson)).toEqual([
      {
        dependencies: {
          "pkg-b": "1.0.1-next.0"
        },
        name: "pkg-a",
        version: "1.0.1-next.2"
      },
      {
        name: "pkg-b",
        version: "1.0.1-next.0"
      }
    ]);
    await writeChangeset(
      {
        releases: [{ name: "pkg-a", type: "minor" }],
        summary: "a very useful summary for the third change"
      },
      cwd
    );
    await version(cwd, defaultOptions, modifiedDefaultConfig);
    packages = (await getPackages(cwd))!;
    expect(packages.packages.map(x => x.packageJson)).toMatchInlineSnapshot(
      [
        {
          dependencies: {
            "pkg-b": "1.0.1-next.0"
          },
          name: "pkg-a",
          version: "1.1.0-next.3"
        },
        {
          name: "pkg-b",
          version: "1.0.1-next.0"
        }
      ],
      `
      Object {
        "0": Object {
          "dependencies": Object {
            "pkg-b": "1.0.1-next.0",
          },
          "name": "pkg-a",
          "version": "1.1.0-next.3",
        },
        "1": Object {
          "name": "pkg-b",
          "version": "1.0.1-next.0",
        },
      }
    `
    );
    await pre(cwd, { command: "exit" });
    await version(cwd, defaultOptions, modifiedDefaultConfig);
    packages = (await getPackages(cwd))!;
    expect(packages.packages.map(x => x.packageJson)).toEqual([
      {
        dependencies: {
          "pkg-b": "1.0.1"
        },
        name: "pkg-a",
        version: "1.1.0"
      },
      {
        name: "pkg-b",
        version: "1.0.1"
      }
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

                                    - a very useful summary for the third change

                                    ### Patch Changes

                                    - a very useful summary
                                    - a very useful summary for the second change
                                    - Updated dependencies [undefined]
                                      - pkg-b@1.0.1

                                    ## 1.1.0-next.3

                                    ### Minor Changes

                                    - a very useful summary for the third change

                                    ## 1.0.1-next.2

                                    ### Patch Changes

                                    - a very useful summary for the second change

                                    ## 1.0.1-next.1

                                    ### Patch Changes

                                    - a very useful summary

                                    ## 1.0.1-next.0

                                    ### Patch Changes

                                    - Updated dependencies [undefined]
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

                                                            - a very useful summary for the first change

                                                            ## 1.0.1-next.0

                                                            ### Patch Changes

                                                            - a very useful summary for the first change
                                                            "
                                        `);
  });
  it("should work with adding a package while in pre mode", async () => {
    let cwd = f.copy("simple-project");
    await pre(cwd, { command: "enter", tag: "next" });
    await writeChangeset(
      {
        releases: [{ name: "pkg-b", type: "patch" }],
        summary: "a very useful summary for the first change"
      },
      cwd
    );

    await version(cwd, defaultOptions, modifiedDefaultConfig);
    let packages = (await getPackages(cwd))!;
    expect(packages.packages.map(x => x.packageJson)).toEqual([
      {
        dependencies: {
          "pkg-b": "1.0.1-next.0"
        },
        name: "pkg-a",
        version: "1.0.1-next.0"
      },
      {
        name: "pkg-b",
        version: "1.0.1-next.0"
      }
    ]);
    await fs.mkdir(path.join(cwd, "packages", "pkg-c"));
    await fs.writeJson(path.join(cwd, "packages", "pkg-c", "package.json"), {
      name: "pkg-c",
      version: "0.0.0"
    });
    await writeChangeset(
      {
        releases: [
          { name: "pkg-b", type: "major" },
          { name: "pkg-c", type: "patch" }
        ],
        summary: "a very useful summary for the first change"
      },
      cwd
    );
    await version(cwd, defaultOptions, modifiedDefaultConfig);
    packages = (await getPackages(cwd))!;

    expect(packages.packages.map(x => x.packageJson)).toEqual([
      {
        dependencies: {
          "pkg-b": "2.0.0-next.1"
        },
        name: "pkg-a",
        version: "1.0.1-next.1"
      },
      {
        name: "pkg-b",
        version: "2.0.0-next.1"
      },
      {
        name: "pkg-c",
        version: "0.0.1-next.0"
      }
    ]);
  });
  it("should work for my weird case", async () => {
    let cwd = f.copy("simple-project");
    await writeChangeset(
      {
        releases: [{ name: "pkg-a", type: "minor" }],
        summary: "a very useful summary for the first change"
      },
      cwd
    );
    await version(cwd, defaultOptions, modifiedDefaultConfig);
    let packages = (await getPackages(cwd))!;

    expect(packages.packages.map(x => x.packageJson)).toEqual([
      {
        dependencies: { "pkg-b": "1.0.0" },
        name: "pkg-a",
        version: "1.1.0"
      },
      {
        name: "pkg-b",
        version: "1.0.0"
      }
    ]);

    await pre(cwd, { command: "enter", tag: "next" });
    await writeChangeset(
      {
        releases: [{ name: "pkg-a", type: "patch" }],
        summary: "a very useful summary for the first change"
      },
      cwd
    );
    await version(cwd, defaultOptions, modifiedDefaultConfig);
    packages = (await getPackages(cwd))!;

    expect(packages.packages.map(x => x.packageJson)).toEqual([
      {
        dependencies: { "pkg-b": "1.0.0" },
        name: "pkg-a",
        version: "1.1.1-next.0"
      },
      {
        name: "pkg-b",
        version: "1.0.0"
      }
    ]);
  });
  it("should work with linked", async () => {
    let linkedConfig = {
      ...modifiedDefaultConfig,
      linked: [["pkg-a", "pkg-b"]]
    };
    let cwd = f.copy("simple-project");
    await writeChangeset(
      {
        releases: [{ name: "pkg-a", type: "minor" }],
        summary: "a very useful summary"
      },
      cwd
    );
    await version(cwd, defaultOptions, linkedConfig);
    let packages = (await getPackages(cwd))!;

    expect(packages.packages.map(x => x.packageJson)).toEqual([
      {
        dependencies: { "pkg-b": "1.0.0" },
        name: "pkg-a",
        version: "1.1.0"
      },
      {
        name: "pkg-b",
        version: "1.0.0"
      }
    ]);

    await pre(cwd, { command: "enter", tag: "next" });
    await writeChangeset(
      {
        releases: [{ name: "pkg-b", type: "patch" }],
        summary: "a very useful summary"
      },
      cwd
    );
    await version(cwd, defaultOptions, linkedConfig);
    packages = (await getPackages(cwd))!;

    expect(packages.packages.map(x => x.packageJson)).toEqual([
      {
        dependencies: { "pkg-b": "1.1.1-next.0" },
        name: "pkg-a",
        version: "1.1.1-next.0"
      },
      {
        name: "pkg-b",
        version: "1.1.1-next.0"
      }
    ]);
    await writeChangeset(
      {
        releases: [{ name: "pkg-a", type: "patch" }],
        summary: "a very useful summary"
      },
      cwd
    );
    await version(cwd, defaultOptions, linkedConfig);
    packages = (await getPackages(cwd))!;
    expect(packages.packages.map(x => x.packageJson)).toEqual([
      {
        dependencies: { "pkg-b": "1.1.1-next.0" },
        name: "pkg-a",
        version: "1.1.1-next.1"
      },
      {
        name: "pkg-b",
        version: "1.1.1-next.0"
      }
    ]);
    await writeChangeset(
      {
        releases: [{ name: "pkg-a", type: "patch" }],
        summary: "a very useful summary"
      },
      cwd
    );
    await version(cwd, defaultOptions, linkedConfig);
    packages = (await getPackages(cwd))!;
    expect(packages.packages.map(x => x.packageJson)).toEqual([
      {
        dependencies: { "pkg-b": "1.1.1-next.0" },
        name: "pkg-a",
        version: "1.1.1-next.2"
      },
      {
        name: "pkg-b",
        version: "1.1.1-next.0"
      }
    ]);
  });
  it("should use the highest bump type for between all prereleases for every prerelease", async () => {
    let cwd = f.copy("simple-project");
    await writeChangeset(
      {
        releases: [{ name: "pkg-a", type: "major" }],
        summary: "a very useful summary for the first change"
      },
      cwd
    );

    await pre(cwd, { command: "enter", tag: "next" });
    await version(cwd, defaultOptions, modifiedDefaultConfig);
    let packages = (await getPackages(cwd))!;

    expect(packages.packages.map(x => x.packageJson)).toEqual([
      {
        dependencies: { "pkg-b": "1.0.0" },
        name: "pkg-a",
        version: "2.0.0-next.0"
      },
      {
        name: "pkg-b",
        version: "1.0.0"
      }
    ]);

    await writeChangeset(
      {
        releases: [{ name: "pkg-a", type: "minor" }],
        summary: "a very useful summary for the second change"
      },
      cwd
    );
    await version(cwd, defaultOptions, modifiedDefaultConfig);
    packages = (await getPackages(cwd))!;

    expect(packages.packages.map(x => x.packageJson)).toEqual([
      {
        dependencies: { "pkg-b": "1.0.0" },
        name: "pkg-a",
        version: "2.0.0-next.1"
      },
      {
        name: "pkg-b",
        version: "1.0.0"
      }
    ]);
  });
  it("should not bump packages through devDependencies", async() => {
    let cwd = f.copy("simple-dev-dep");
    await writeChangeset(
      {
        releases: [{ name: "pkg-b", type: "major" }],
        summary: "a very useful summary for the first change"
      },
      cwd
    );

    await pre(cwd, { command: "enter", tag: "next" });
    await version(cwd, defaultOptions, modifiedDefaultConfig);
    let packages = (await getPackages(cwd))!;

    expect(packages.packages.map(x => x.packageJson)).toEqual([
      {
        devDependencies: { "pkg-b": "2.0.0-next.0" },
        name: "pkg-a",
        version: "1.0.0"
      },
      {
        name: "pkg-b",
        version: "2.0.0-next.0"
      }
    ]);
  });
  it("should not bump ignored packages through dependencies", async() => {
    let cwd = f.copy("simple-project-with-ignore-config");
    await writeChangeset(
      {
        releases: [{ name: "pkg-a", type: "major" }, { name: "pkg-b", type: "major" }],
        summary: "a very useful summary for the first change"
      },
      cwd
    );

    await pre(cwd, { command: "enter", tag: "next" });
    await version(cwd, defaultOptions, modifiedDefaultConfig);
    let packages = (await getPackages(cwd))!;

    expect(packages.packages.map(x => x.packageJson)).toEqual([
      {
        devDependencies: { "pkg-b": "2.0.0-next.0" },
        name: "pkg-a",
        version: "1.0.0"
      },
      {
        name: "pkg-b",
        version: "2.0.0-next.0"
      }
    ]);

  });
});
