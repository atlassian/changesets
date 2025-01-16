import { getGithubRepoInfo } from "./githubRelease";

describe("getGithubRepoInfo", () => {
  it("should get GitHub repository info", async () => {
    const result = await getGithubRepoInfo();
    // console.log(result);
    expect(result).toEqual({
      repoOwner: expect.any(String),
      repoName: expect.any(String),
    });
  });
});
