import { join } from "path";
import { testdir } from "@changesets/test-utils";
import { PackageJSON } from "@changesets/types";
import { getPackages, Packages } from "./";

let defaultPackages = (dir: string): Packages => ({
  root: {
    packageJson: {
      name: "root",
      version: "1.2.3",
      workspaces: ["packages/*"],
    } as PackageJSON,
    dir,
  },
  packages: [],
  tool: "yarn",
});

const withAdditionalPackages = (
  cwd: string,
  additionalPackages: Array<{ name: string; version: string; dir: string }>
) => ({
  ...defaultPackages(cwd),
  packages: additionalPackages.map(({ dir, ...packageJson }) => ({
    packageJson,
    dir: join(cwd, dir),
  })),
});

describe("getPackages", () => {
  it("reads the workspace packages", async () => {
    let cwd = await testdir({
      "package.json": JSON.stringify({
        name: "root",
        version: "1.2.3",
        workspaces: ["packages/*"],
      }),
      "packages/pkg-a/package.json": JSON.stringify({
        name: "pkg-a",
        version: "1.0.0",
      }),
    });

    await expect(getPackages(cwd)).resolves.toEqual(
      withAdditionalPackages(cwd, [
        { name: "pkg-a", version: "1.0.0", dir: "packages/pkg-a" },
      ])
    );
  });

  it("reads the config and loads additional packages", async () => {
    let cwd = await testdir({
      ".changeset/config.json": JSON.stringify({
        ___experimentalUnsafeOptions_WILL_CHANGE_IN_PATCH: {
          additionalWorkspaces: ["shmackages/*"],
        },
      }),
      "package.json": JSON.stringify({
        name: "root",
        version: "1.2.3",
        workspaces: ["packages/*"],
      }),
      "packages/pkg-a/package.json": JSON.stringify({
        name: "pkg-a",
        version: "1.0.0",
      }),
      "shmackages/pkg-b/package.json": JSON.stringify({
        name: "pkg-b",
        version: "1.0.0",
      }),
    });

    await expect(getPackages(cwd)).resolves.toEqual(
      withAdditionalPackages(cwd, [
        { name: "pkg-a", version: "1.0.0", dir: "packages/pkg-a" },
        { name: "pkg-b", version: "1.0.0", dir: "shmackages/pkg-b" },
      ])
    );
  });

  it("loads additional packages when only root exists", async () => {
    let cwd = await testdir({
      ".changeset/config.json": JSON.stringify({
        ___experimentalUnsafeOptions_WILL_CHANGE_IN_PATCH: {
          additionalWorkspaces: ["shmackages/*"],
        },
      }),
      "package.json": JSON.stringify({
        name: "root",
        version: "1.2.3",
      }),
      "shmackages/pkg-b/package.json": JSON.stringify({
        name: "pkg-b",
        version: "1.0.0",
      }),
    });

    await expect(getPackages(cwd)).resolves.toEqual({
      ...withAdditionalPackages(cwd, [
        { name: "pkg-b", version: "1.0.0", dir: "shmackages/pkg-b" },
      ]),
      root: { packageJson: { name: "root", version: "1.2.3" }, dir: cwd },
    });
  });

  it("throws an error when additionalWorkspaces is not an array", async () => {
    let cwd = await testdir({
      ".changeset/config.json": JSON.stringify({
        ___experimentalUnsafeOptions_WILL_CHANGE_IN_PATCH: {
          additionalWorkspaces: "shmackages/*",
        },
      }),
      "package.json": JSON.stringify({
        name: "root",
        version: "1.2.3",
      }),
    });

    await expect(getPackages(cwd)).rejects.toThrowError(
      "additionalWorkspaces must be an array of strings"
    );
  });

  it("throws an error when no package.json is found", async () => {
    let cwd = await testdir({});

    await expect(getPackages(cwd)).rejects.toThrowError();
  });

  it("reads the root package if there are no workspaces", async () => {
    let cwd = await testdir({
      "package.json": JSON.stringify({
        name: "root",
        version: "1.2.3",
      }),
    });

    await expect(getPackages(cwd)).resolves.toEqual({
      root: { packageJson: { name: "root", version: "1.2.3" }, dir: cwd },
      packages: [{ packageJson: { name: "root", version: "1.2.3" }, dir: cwd }],
      tool: "root",
    });
  });

  it("returns empty if no packages are found in package.json workspaces", async () => {
    let cwd = await testdir({
      "package.json": JSON.stringify({
        name: "root",
        version: "1.2.3",
        workspaces: ["packages/*"],
      }),
    });

    await expect(getPackages(cwd)).resolves.toEqual({
      root: {
        packageJson: {
          name: "root",
          version: "1.2.3",
          workspaces: ["packages/*"],
        },
        dir: cwd,
      },
      packages: [],
      tool: "yarn",
    });
  });

  it("returns empty if no packages are found in additionalWorkspaces", async () => {
    let cwd = await testdir({
      ".changeset/config.json": JSON.stringify({
        ___experimentalUnsafeOptions_WILL_CHANGE_IN_PATCH: {
          additionalWorkspaces: ["shmackages/*"],
        },
      }),
      "package.json": JSON.stringify({
        name: "root",
        version: "1.2.3",
        workspaces: ["packages/*"],
      }),
    });

    await expect(getPackages(cwd)).resolves.toEqual(defaultPackages(cwd));
  });
});
