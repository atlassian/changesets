import fs from "fs";
import fsp from "fs/promises";
import path from "path";
import { defaultWrittenConfig } from "@changesets/config";
import { silenceLogsInBlock, testdir } from "@changesets/test-utils";

import initializeCommand from "..";

const getPaths = (cwd: string) => ({
  readmePath: path.join(cwd, ".changeset/README.md"),
  configPath: path.join(cwd, ".changeset/config.json"),
});

describe("init", () => {
  silenceLogsInBlock();
  it("should initialize in a project without a .changeset folder", async () => {
    const cwd = await testdir({});
    const { readmePath, configPath } = getPaths(cwd);

    expect(fs.existsSync(readmePath)).toBe(false);
    expect(fs.existsSync(configPath)).toBe(false);
    await initializeCommand(cwd);
    expect(fs.existsSync(readmePath)).toBe(true);
    expect(fs.existsSync(configPath)).toBe(true);
  });
  it("should write the default config if it doesn't exist", async () => {
    const cwd = await testdir({
      "package.json": JSON.stringify({
        private: true,
        workspaces: ["packages/*"],
      }),
    });

    await initializeCommand(cwd);
    expect(
      JSON.parse(
        await fsp.readFile(path.join(cwd, ".changeset/config.json"), "utf8")
      )
    ).toEqual({ ...defaultWrittenConfig, baseBranch: "main" });
  });
  it("should add newline at the end of config", async () => {
    const cwd = await testdir({
      "package.json": JSON.stringify({
        private: true,
        workspaces: ["packages/*"],
      }),
    });

    await initializeCommand(cwd);

    const configPath = path.join(cwd, ".changeset/config.json");
    const config = (await fsp.readFile(configPath)).toString();
    const lastCharacter = config.slice(-1);

    expect(lastCharacter).toBe("\n");
  });
  it("shouldn't overwrite a config if it does exist", async () => {
    const cwd = await testdir({
      "package.json": JSON.stringify({
        private: true,
        workspaces: ["packages/*"],
      }),
      ".changeset/config.json": JSON.stringify({
        changelog: false,
      }),
    });

    await initializeCommand(cwd);
    expect(
      JSON.parse(
        await fsp.readFile(path.join(cwd, ".changeset/config.json"), "utf8")
      )
    ).toEqual({
      changelog: false,
    });
  });
});
