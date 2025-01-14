import { error } from "@changesets/logger";
import { testdir } from "@changesets/test-utils";

import { run } from "./run";

import * as npmUtils from "./commands/publish/npm-utils";

jest.mock("@changesets/logger");
jest.mock("./commands/version");
jest.mock("./commands/publish/npm-utils");

describe("cli", () => {
  describe("version", () => {
    it("should validate package name passed in from --ignore flag", async () => {
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
      try {
        await run(["version"], { ignore: "pkg-c" }, cwd);
      } catch (e) {
        // ignore errors. We just want to validate the error message
      }

      const loggerErrorCalls = (error as any).mock.calls;
      expect(loggerErrorCalls.length).toEqual(1);
      expect(loggerErrorCalls[0][0]).toEqual(
        `The package "pkg-c" is passed to the \`--ignore\` option but it is not found in the project. You may have misspelled the package name.`
      );
    });

    it("should throw if dependents of ignored packages are not explicitly listed in the ignore array", async () => {
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
      try {
        await run(["version"], { ignore: ["pkg-b"] }, cwd);
      } catch (e) {
        // ignore the error. We just want to validate the error message
      }

      const loggerErrorCalls = (error as any).mock.calls;
      expect(loggerErrorCalls.length).toEqual(1);
      expect(loggerErrorCalls[0][0]).toMatchInlineSnapshot(
        `"The package "pkg-a" depends on the skipped package "pkg-b" (either by \`ignore\` option or by \`privatePackages.version\`), but "pkg-a" is not being skipped. Please pass "pkg-a" to the \`--ignore\` flag."`
      );
    });

    it("should not throw if dependents of unversioned private packages are not explicitly listed by the ignore flag", async () => {
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
        ".changeset/config.json": JSON.stringify({
          privatePackages: {
            tag: false,
            version: false,
          },
        }),
      });
      try {
        await run(["version"], { ignore: ["pkg-b"] }, cwd);
      } catch (e) {
        // ignore the error. We just want to validate the error message
      }

      const loggerErrorCalls = (error as any).mock.calls;
      expect(loggerErrorCalls.length).toEqual(0);
    });

    it("should not throw on a dev dependent on an unversioned private package", async () => {
      const cwd = await testdir({
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
          private: true,
        }),
        ".changeset/config.json": JSON.stringify({
          privatePackages: {
            tag: false,
            version: false,
          },
        }),
      });
      try {
        await run(["version"], {}, cwd);
      } catch (e) {
        // ignore the error. We just want to validate the error message
      }

      const loggerErrorCalls = (error as any).mock.calls;
      expect(loggerErrorCalls.length).toEqual(0);
    });

    it("should throw if `--ignore` flag is used while ignore array is also defined in the config file ", async () => {
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
        ".changeset/config.json": JSON.stringify({
          ignore: ["pkg-a"],
        }),
      });
      try {
        await run(["version"], { ignore: "pkg-b" }, cwd);
      } catch (e) {
        // ignore errors. We just want to validate the error message
      }

      const loggerErrorCalls = (error as any).mock.calls;
      expect(loggerErrorCalls.length).toEqual(1);
      expect(loggerErrorCalls[0][0]).toEqual(
        `It looks like you are trying to use the \`--ignore\` option while ignore is defined in the config file. This is currently not allowed, you can only use one of them at a time.`
      );
    });
  });

  describe("publish", () => {
    it("should publish only one specified package", async () => {
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
        "packages/pkg-c/package.json": JSON.stringify({
          name: "pkg-c",
          version: "1.0.0",
        }),
        ".changeset/config.json": JSON.stringify({}),
      });

      // @ts-ignore
      npmUtils.infoAllow404.mockImplementation(() => ({
        published: false,
        pkgInfo: {
          version: "1.0.0",
        },
      }));

      // @ts-ignore
      npmUtils.publish.mockImplementation(() => ({
        published: true,
      }));

      try {
        await run(
          ["publish"],
          {
            filter: "pkg-a",
          },
          cwd
        );
      } catch (e) {
        // ignore errors. We just want to validate the error message
      }

      expect(npmUtils.publish).toHaveBeenCalledWith(
        "pkg-a",
        expect.any(Object),
        expect.any(Object)
      );
    });

    it("should publish only public specified package", async () => {
      const cwd = await testdir({
        "package.json": JSON.stringify({
          private: true,
          workspaces: ["packages/*"],
        }),
        "packages/pkg-a/package.json": JSON.stringify({
          private: true,
          name: "pkg-a",
          version: "1.0.0",
        }),
        "packages/pkg-b/package.json": JSON.stringify({
          name: "pkg-b",
          version: "1.0.0",
        }),
        "packages/pkg-c/package.json": JSON.stringify({
          name: "pkg-c",
          version: "1.0.0",
        }),
        ".changeset/config.json": JSON.stringify({}),
      });

      // @ts-ignore
      npmUtils.infoAllow404.mockImplementation(() => ({
        published: false,
        pkgInfo: {
          version: "1.0.0",
        },
      }));

      // @ts-ignore
      npmUtils.publish.mockImplementation(() => ({
        published: true,
      }));

      try {
        await run(
          ["publish"],
          {
            filter: ["pkg-a", "pkg-b"],
          },
          cwd
        );
      } catch (e) {
        // ignore errors. We just want to validate the error message
      }

      expect(npmUtils.publish).toHaveBeenCalledWith(
        "pkg-b",
        expect.any(Object),
        expect.any(Object)
      );
    });

    it("should publish all packages when filter is undefined", async () => {
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
        ".changeset/config.json": JSON.stringify({}),
      });

      // @ts-ignore
      npmUtils.publish.mockImplementation(() => ({
        published: true,
      }));

      try {
        await run(["publish"], {}, cwd);
      } catch (e) {
        // Ignore errors; validate only the behavior
      }

      expect(npmUtils.publish).toHaveBeenCalledWith(
        "pkg-a",
        expect.any(Object),
        expect.any(Object)
      );
      expect(npmUtils.publish).toHaveBeenCalledWith(
        "pkg-b",
        expect.any(Object),
        expect.any(Object)
      );
    });

    it("should publish only the package specified as a string filter", async () => {
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
        ".changeset/config.json": JSON.stringify({}),
      });

      // @ts-ignore
      npmUtils.publish.mockImplementation(() => ({
        published: true,
      }));

      try {
        await run(["publish"], { filter: "pkg-a" }, cwd);
      } catch (e) {
        // Ignore errors; validate only the behavior
      }

      expect(npmUtils.publish).toHaveBeenCalledWith(
        "pkg-a",
        expect.any(Object),
        expect.any(Object)
      );
    });
  });
});
