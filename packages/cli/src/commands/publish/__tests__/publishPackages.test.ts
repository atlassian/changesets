import publishPackages from "../publishPackages";
import { infoAllow404, getTokenIsRequired, publish } from "../npm-utils";
import { getPackages } from "@manypkg/get-packages";
import { silenceLogsInBlock, testdir } from "@changesets/test-utils";

jest.mock("../npm-utils");
const infoAllow404Mocked = jest.mocked(infoAllow404);
const getTokenIsRequiredMocked = jest.mocked(getTokenIsRequired);
const publishMocked = jest.mocked(publish);

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

      infoAllow404Mocked.mockResolvedValue({
        published: false,
        pkgInfo: {
          version: "1.0.0",
        },
      });

      publishMocked.mockResolvedValue({
        published: true,
      });

      await publishPackages({
        packages: (await getPackages(cwd)).packages,
        access: "public",
        preState: undefined,
      });
      expect(getTokenIsRequiredMocked).not.toHaveBeenCalled();
    });
  });
});
