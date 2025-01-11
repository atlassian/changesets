import {
  getPackages as manyPkgGetPackages,
  Package,
  Packages,
  Tool,
} from "@manypkg/get-packages";
import { mkdtemp, readJSON, remove, writeFile, realpath } from "fs-extra";
import { join } from "path";
import { tmpdir } from "os";
import { WrittenConfig } from "@changesets/types";

const UNSAFE_KEY = "___experimentalUnsafeOptions_WILL_CHANGE_IN_PATCH";

let loadAdditionalWorkspaces = async (cwd: string): Promise<string[]> => {
  let workspaces: string[] = [];
  try {
    let json = (await readJSON(
      join(cwd, ".changeset", "config.json")
    )) as WrittenConfig;

    if (json === undefined) return workspaces;
    if (json[UNSAFE_KEY] === undefined) return workspaces;
    if (json[UNSAFE_KEY].additionalWorkspaces === undefined) return workspaces;

    workspaces = json[UNSAFE_KEY].additionalWorkspaces;
  } catch {
    return workspaces;
  }

  if (Array.isArray(workspaces)) {
    return workspaces;
  } else {
    throw new Error("additionalWorkspaces must be an array of strings");
  }
};

let mkdTempDir = async (prefix: string) => {
  const tmpDir = join(await realpath(tmpdir()), prefix);
  return mkdtemp(tmpDir);
};

let makeTempPackageJson = async (cwd: string, workspaces: string[]) => {
  const tmpDir = await mkdTempDir("changesets-workspaces");
  const tmpPkg = join(tmpDir, "package.json");
  await writeFile(
    tmpPkg,
    JSON.stringify({
      name: "tmp",
      private: true,
      workspaces: workspaces.map((w) => join(cwd, w)),
    })
  );
  return { tmpDir, clean: () => remove(tmpDir) };
};

let mergePackages = async (
  rootPackages: Packages,
  additionalPackages: Packages
): Promise<Packages> => {
  if (rootPackages.tool === "root") {
    return {
      ...rootPackages,
      tool: "yarn",
      packages: additionalPackages.packages,
    };
  }

  return {
    ...rootPackages,
    packages: [...rootPackages.packages, ...additionalPackages.packages],
  };
};

export let getPackages = async (cwd: string): Promise<Packages> => {
  const rootPackagesPromise = manyPkgGetPackages(cwd);

  const workspaces = await loadAdditionalWorkspaces(cwd);
  if (workspaces.length === 0) return rootPackagesPromise;

  const { tmpDir, clean } = await makeTempPackageJson(cwd, workspaces);
  const additional = await manyPkgGetPackages(tmpDir);
  clean();

  if (additional.packages.length === 0) return rootPackagesPromise;

  const rootPackages = await rootPackagesPromise;

  return mergePackages(rootPackages, additional);
};

export type { Package, Packages, Tool };
