import publishPackages from "../publishPackages";
import * as npmUtils from "../npm-utils";
import { getPackages } from "@changesets/get-packages";
import { silenceLogsInBlock, testdir } from "@changesets/test-utils";

jest.mock("../npm-utils");
jest.mock("ci-info", () => ({
  isCI: true,
}));

describe("publishPackages", () => {
  silenceLogsInBlock();

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("when isCI", () => {
    it("does not call out to npm to see if otp is required", async () => {
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

      await publishPackages({
        packages: (await getPackages(cwd)).packages,
        access: "public",
        preState: undefined,
      });
      expect(npmUtils.getTokenIsRequired).not.toHaveBeenCalled();
    });
  });
});
