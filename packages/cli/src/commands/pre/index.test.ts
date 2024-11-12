import path from "path";
import pc from "picocolors";
import * as fs from "fs-extra";
import * as logger from "@changesets/logger";
import { ExitError } from "@changesets/errors";
import { testdir } from "@changesets/test-utils";

import pre from "./index";

jest.mock("@changesets/logger");

let mockedLogger = logger as jest.Mocked<typeof logger>;

describe("enterPre", () => {
  it("should enter", async () => {
    const cwd = await testdir({
      "package.json": JSON.stringify({
        private: true,
        workspaces: ["packages/*"],
      }),
    });
    await pre(cwd, { command: "enter", tag: "next" });

    await expect(
      fs.readJson(path.join(cwd, ".changeset", "pre.json"))
    ).resolves.toMatchObject({
      changesets: [],
      initialVersions: {},
      mode: "pre",
      tag: "next",
    });
    expect(mockedLogger.success).toHaveBeenCalledWith(
      `Entered pre mode with tag ${pc.cyan("next")}`
    );
  });
  it("should throw if already in pre", async () => {
    const cwd = await testdir({
      "package.json": JSON.stringify({
        private: true,
        workspaces: ["packages/*"],
      }),
      ".changeset/pre.json": JSON.stringify({
        changesets: [],
        initialVersions: {},
        mode: "pre",
        tag: "next",
      }),
    });

    await expect(
      pre(cwd, { command: "enter", tag: "next" })
    ).rejects.toBeInstanceOf(ExitError);
    expect(mockedLogger.error).toHaveBeenCalledWith(
      "`changeset pre enter` cannot be run when in pre mode"
    );
    expect(logger.info).toHaveBeenCalledWith(
      "If you're trying to exit pre mode, run `changeset pre exit`"
    );
  });
  it("should enter if already exited pre mode", async () => {
    const cwd = await testdir({
      "package.json": JSON.stringify({
        private: true,
        workspaces: ["packages/*"],
      }),
      ".changeset/pre.json": JSON.stringify({
        changesets: [],
        initialVersions: {},
        mode: "exit",
        tag: "beta",
      }),
    });

    await pre(cwd, { command: "enter", tag: "next" });
    await expect(
      fs.readJson(path.join(cwd, ".changeset", "pre.json"))
    ).resolves.toEqual({
      changesets: [],
      initialVersions: {},
      mode: "pre",
      tag: "next",
    });
    expect(mockedLogger.success).toHaveBeenCalledWith(
      `Entered pre mode with tag ${pc.cyan("next")}`
    );
  });
});

describe("exitPre", () => {
  it("should exit", async () => {
    const cwd = await testdir({
      "package.json": JSON.stringify({
        private: true,
        workspaces: ["packages/*"],
      }),
      ".changeset/pre.json": JSON.stringify({
        changesets: [],
        initialVersions: {},
        mode: "pre",
        tag: "next",
      }),
    });
    await pre(cwd, { command: "exit" });

    await expect(
      fs.readJson(path.join(cwd, ".changeset", "pre.json"))
    ).resolves.toEqual({
      changesets: [],
      initialVersions: {},
      mode: "exit",
      tag: "next",
    });
  });
  it("should throw if not in pre", async () => {
    const cwd = await testdir({
      "package.json": JSON.stringify({
        private: true,
        workspaces: ["packages/*"],
      }),
    });
    await expect(pre(cwd, { command: "exit" })).rejects.toBeInstanceOf(
      ExitError
    );
    expect(mockedLogger.error).toHaveBeenCalledWith(
      "`changeset pre exit` can only be run when in pre mode"
    );
    expect(logger.info).toHaveBeenCalledWith(
      "If you're trying to enter pre mode, run `changeset pre enter`"
    );
  });
});
