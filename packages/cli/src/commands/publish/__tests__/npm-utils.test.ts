import { initPackageManager, testdir } from "@changesets/test-utils";
import { getPublishCommand, PublishOptions } from "../npm-utils";
import { TwoFactorState } from "../../../utils/types";

function callGetPublishCommand(
  cwd: string,
  publishOpts?: Partial<PublishOptions>,
  twoFactorState?: TwoFactorState
) {
  return getPublishCommand(
    {
      cwd,
      tag: "latest",
      access: "public",
      publishDir: ".",
      ...publishOpts,
    },
    twoFactorState ?? { isRequired: Promise.resolve(false), token: null }
  );
}

describe("npm utils", () => {
  describe("getPublishCommand", () => {
    it("returns npm command by default", async () => {
      const cwd = await testdir({
        "package.json": JSON.stringify({ private: true }),
      });
      const { cmd, args } = await callGetPublishCommand(cwd);
      expect(cmd).toBe("npm");
      expect(args).toEqual([
        "publish",
        ".",
        "--json",
        "--access",
        "public",
        "--tag",
        "latest",
      ]);
    });

    it("returns npm command with correct tag, access, publishDir based on option", async () => {
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
      const { cmd, args } = await callGetPublishCommand(cwd, {
        tag: "next",
        access: "restricted",
        publishDir: "./packages/pkg-a",
      });
      expect(cmd).toBe("npm");
      expect(args).toEqual([
        "publish",
        "./packages/pkg-a",
        "--json",
        "--access",
        "restricted",
        "--tag",
        "next",
      ]);
    });

    it("returns pnpm command in pnpm project", async () => {
      const cwd = await testdir({
        "package.json": JSON.stringify({ private: true }),
      });
      await initPackageManager(cwd, "pnpm");
      const { cmd, args } = await callGetPublishCommand(cwd);
      expect(cmd).toBe("pnpm");
      expect(args).toEqual([
        [
          "publish",
          "--json",
          "--access",
          "public",
          "--tag",
          "latest",
          "--no-git-checks",
        ],
      ]);
    });
  });
});
