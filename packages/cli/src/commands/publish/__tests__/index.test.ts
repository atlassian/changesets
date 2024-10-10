import publishCommand from "../index.ts";
import { defaultConfig } from "@changesets/config";
import * as path from "path";
import { Config } from "@changesets/types";
import { silenceLogsInBlock, testdir } from "@changesets/test-utils";

let changelogPath = path.resolve(__dirname, "../../changelog");
let modifiedDefaultConfig: Config = {
  ...defaultConfig,
  changelog: [changelogPath, null],
};

describe("Publish command", () => {
  silenceLogsInBlock();

  describe("in pre state", () => {
    it("should report error if the tag option is used in pre release", async () => {
      const cwd = await testdir({
        "package.json": JSON.stringify({
          private: true,
          workspaces: ["packages/*"],
        }),
        "packages/pkg-a/package.json": JSON.stringify({
          name: "pkg-a",
          version: "1.0.0",
        }),
        ".changeset/pre.json": JSON.stringify({
          mode: "pre",
        }),
      });
      await expect(
        publishCommand(cwd, { tag: "experimental" }, modifiedDefaultConfig)
      ).rejects.toThrowError();
    });
  });
});
