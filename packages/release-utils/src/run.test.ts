import { add, commit } from "@changesets/git";
import { silenceLogsInBlock, tempdir, testdir } from "@changesets/test-utils";
import { Changeset } from "@changesets/types";
import writeChangeset from "@changesets/write";
import fileUrl from "file-url";
import fs from "node:fs/promises";
import path from "path";
import spawn from "spawndamnit";
import { getCurrentBranch } from "./gitUtils.ts";
import { runPublish, runVersion } from "./run.ts";

const linkNodeModules = async (cwd: string) => {
  await fs.symlink(
    path.join(__dirname, "..", "..", "..", "node_modules"),
    path.join(cwd, "node_modules")
  );
};
const writeChangesets = (changesets: Changeset[], cwd: string) => {
  return Promise.all(changesets.map((commit) => writeChangeset(commit, cwd)));
};

jest.setTimeout(10000);
silenceLogsInBlock();

beforeEach(() => {
  jest.clearAllMocks();
});

async function setupRepoAndClone(cwd: string) {
  await spawn("git", ["init"], { cwd });
  await add(".", cwd);
  await commit("commit1", cwd);

  const mainBranch = await getCurrentBranch(cwd);

  // Make a 1-commit-deep shallow clone of this repo
  let clone = tempdir();
  await spawn(
    "git",
    // Note: a file:// URL is needed in order to make a shallow clone of
    // a local repo
    ["clone", "--depth", "1", fileUrl(cwd), "."],
    {
      cwd: clone,
    }
  );
  await spawn("git", ["checkout", "-b", "some-other-branch"], { cwd });
  return { clone, mainBranch };
}

describe("version", () => {
  it("returns the right changed packages and pushes to the remote", async () => {
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
          releases: [
            {
              name: "pkg-a",
              type: "minor",
            },
            {
              name: "pkg-b",
              type: "minor",
            },
          ],
          summary: "Awesome feature",
        },
      ],
      cwd
    );

    const { clone, mainBranch } = await setupRepoAndClone(cwd);

    await linkNodeModules(clone);

    const { changedPackages } = await runVersion({
      cwd: clone,
    });

    await spawn("git", ["checkout", `changeset-release/${mainBranch}`], {
      cwd,
    });

    expect(
      await fs.readFile(
        path.join(cwd, "packages", "pkg-a", "package.json"),
        "utf8"
      )
    ).toMatchInlineSnapshot(`
      "{
        "name": "pkg-a",
        "version": "1.1.0",
        "dependencies": {
          "pkg-b": "1.1.0"
        }
      }"
    `);

    expect(
      await fs.readFile(
        path.join(cwd, "packages", "pkg-b", "package.json"),
        "utf8"
      )
    ).toMatchInlineSnapshot(`
      "{
        "name": "pkg-b",
        "version": "1.1.0"
      }"
    `);
    expect(
      await fs.readFile(
        path.join(cwd, "packages", "pkg-a", "CHANGELOG.md"),
        "utf8"
      )
    ).toEqual(
      expect.stringContaining(`# pkg-a

## 1.1.0

### Minor Changes

`)
    );
    expect(
      await fs.readFile(
        path.join(cwd, "packages", "pkg-b", "CHANGELOG.md"),
        "utf8"
      )
    ).toEqual(
      expect.stringContaining(`# pkg-b

## 1.1.0

### Minor Changes

`)
    );
    expect(changedPackages).toEqual([
      {
        dir: path.join(clone, "packages", "pkg-a"),
        packageJson: {
          name: "pkg-a",
          version: "1.1.0",
          dependencies: {
            "pkg-b": "1.1.0",
          },
        },
      },
      {
        dir: path.join(clone, "packages", "pkg-b"),
        packageJson: { name: "pkg-b", version: "1.1.0" },
      },
    ]);
  });

  it("only includes bumped packages in the returned changed packages", async () => {
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
      "packages/pkg-b/package.json": JSON.stringify(
        {
          name: "pkg-b",
          version: "1.0.0",
        },
        null,
        2
      ),
      ".changeset/config.json": JSON.stringify({}),
    });

    await writeChangesets(
      [
        {
          releases: [
            {
              name: "pkg-a",
              type: "minor",
            },
          ],
          summary: "Awesome feature",
        },
      ],
      cwd
    );

    const { clone, mainBranch } = await setupRepoAndClone(cwd);

    await linkNodeModules(clone);

    const { changedPackages } = await runVersion({
      cwd: clone,
    });

    await spawn("git", ["checkout", `changeset-release/${mainBranch}`], {
      cwd,
    });

    expect(
      await fs.readFile(
        path.join(cwd, "packages", "pkg-a", "package.json"),
        "utf8"
      )
    ).toMatchInlineSnapshot(`
      "{
        "name": "pkg-a",
        "version": "1.1.0",
        "dependencies": {
          "pkg-b": "1.0.0"
        }
      }"
    `);

    expect(
      await fs.readFile(
        path.join(cwd, "packages", "pkg-b", "package.json"),
        "utf8"
      )
    ).toMatchInlineSnapshot(`
      "{
        "name": "pkg-b",
        "version": "1.0.0"
      }"
    `);

    expect(
      await fs.readFile(
        path.join(cwd, "packages", "pkg-a", "CHANGELOG.md"),
        "utf8"
      )
    ).toEqual(
      expect.stringContaining(`# pkg-a

## 1.1.0

### Minor Changes

`)
    );
    await expect(
      fs.readFile(path.join(cwd, "packages", "pkg-b", "CHANGELOG.md"), "utf8")
    ).rejects.toMatchObject({ code: "ENOENT" });
    expect(changedPackages).toEqual([
      {
        dir: path.join(clone, "packages", "pkg-a"),
        packageJson: {
          name: "pkg-a",
          version: "1.1.0",
          dependencies: {
            "pkg-b": "1.0.0",
          },
        },
      },
    ]);
  });

  it("doesn't include ignored package that got a dependency update in returned versions", async () => {
    let cwd = await testdir({
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
      ".changeset/config.json": JSON.stringify({
        ignore: ["pkg-a"],
      }),
    });

    await writeChangesets(
      [
        {
          releases: [
            {
              name: "pkg-b",
              type: "minor",
            },
          ],
          summary: "Awesome feature",
        },
      ],
      cwd
    );

    const { clone } = await setupRepoAndClone(cwd);

    await linkNodeModules(clone);

    let { changedPackages } = await runVersion({
      cwd: clone,
    });
    expect(changedPackages).toEqual([
      {
        dir: path.join(clone, "packages", "pkg-b"),
        packageJson: { name: "pkg-b", version: "1.1.0" },
      },
    ]);
  });
});

describe("publish", () => {
  test("single package repo", async () => {
    const cwd = await testdir({
      "package.json": JSON.stringify({
        private: true,
        name: "single-package",
        version: "1.0.0",
      }),
    });

    const { clone } = await setupRepoAndClone(cwd);

    await linkNodeModules(clone);

    let result = await runPublish({
      script: `node ${require.resolve("./fake-publish-script-single-package")}`,
      cwd: clone,
    });

    expect(result).toEqual({
      published: true,
      publishedPackages: [{ name: "single-package", version: "1.0.0" }],
    });
    let tagsResult = await spawn("git", ["tag"], { cwd });
    expect(tagsResult.stdout.toString("utf8").trim()).toEqual("v1.0.0");
  });
  test("multi package repo", async () => {
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

    const { clone } = await setupRepoAndClone(cwd);

    await linkNodeModules(clone);

    let result = await runPublish({
      script: `node ${require.resolve("./fake-publish-script-multi-package")}`,
      cwd: clone,
    });

    expect(result).toEqual({
      published: true,
      publishedPackages: [
        { name: "pkg-a", version: "1.0.0" },
        { name: "pkg-b", version: "1.0.0" },
      ],
    });
    let tagsResult = await spawn("git", ["tag"], { cwd });
    expect(tagsResult.stdout.toString("utf8").trim()).toEqual(
      "pkg-a@1.0.0\npkg-b@1.0.0"
    );
  });
});
