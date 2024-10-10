import publishPackages from "../publishPackages";
import * as git from "@changesets/git";
import { defaultConfig } from "@changesets/config";
import { silenceLogsInBlock, testdir } from "@changesets/test-utils";
import runRelease from "..";

jest.mock("@changesets/git");
jest.spyOn(git, "tag").mockResolvedValue(true);

jest.mock("../publishPackages");
const publishPackagesMocked = jest.mocked(publishPackages);

describe("running release", () => {
  silenceLogsInBlock();

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("When there is no changeset commits", () => {
    // we make sure we still do this so that a later build can clean up after a previously
    // failed one (where the change was pushed back but not released and the next build has no
    // changeset commits)
    it("should still run publishPackages", async () => {
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

      publishPackagesMocked.mockResolvedValue([
        { name: "pkg-a", newVersion: "1.1.0", published: true },
        { name: "pkg-b", newVersion: "1.0.1", published: true },
      ]);

      await runRelease(cwd, {}, defaultConfig);

      expect(publishPackagesMocked).toHaveBeenCalled();
    });
  });
});
