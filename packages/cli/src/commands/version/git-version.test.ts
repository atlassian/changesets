import fs from "fs-extra";
import path from "path";
import * as git from "@changesets/git";
import { warn } from "@changesets/logger";
import { gitdir } from "@changesets/test-utils";
import writeChangeset from "@changesets/write";
import { Config } from "@changesets/types";
import { defaultConfig } from "@changesets/config";
import version from "./index";
import spawn from "spawndamnit";

let changelogPath = path.resolve(__dirname, "../../changelog");
let modifiedDefaultConfig: Config = {
  ...defaultConfig,
  changelog: [changelogPath, null],
};

jest.mock("../../utils/cli-utilities");
jest.mock("human-id");
jest.mock("@changesets/logger");

const getFile = (pkgName: string, fileName: string, calls: any) => {
  let castCalls: [string, string][] = calls;
  const foundCall = castCalls.find((call) =>
    call[0].endsWith(`${pkgName}${path.sep}${fileName}`)
  );
  if (!foundCall)
    throw new Error(`could not find writing of ${fileName} for: ${pkgName}`);

  // return written content
  return foundCall[1];
};

const getPkgJSON = (pkgName: string, calls: any) => {
  return JSON.parse(getFile(pkgName, "package.json", calls));
};

describe("version since option", () => {
  it("should not detect version since the given ref", async () => {
    const cwd = await gitdir({
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
      ".changeset/changesets-are-beautiful.md": `---
"pkg-a": minor
---

Nice simple summary, much wow
`,
      ".changeset/.ignored-temporarily.md": `---
"pkg-b": minor
---

Awesome feature, hidden behind a feature flag
`,
    });

    await spawn("git", ["checkout", "-b", "new-branch"], { cwd });

    await fs.outputFile(
      path.join(cwd, "packages/pkg-a/a.js"),
      'export default "updated a"'
    );

    await git.add(".", cwd);
    await git.commit("updated a", cwd);

    const spy = jest.spyOn(fs, "writeFile");

    await version(cwd, { since: "main" }, modifiedDefaultConfig);

    expect(spy).not.toHaveBeenCalled();
    // @ts-ignore
    const loggerWarnCalls = warn.mock.calls;
    expect(loggerWarnCalls.length).toEqual(1);
    expect(loggerWarnCalls[0][0]).toEqual(
      "No unreleased changesets found, exiting."
    );
  });

  it("should only bump packages that have changed since the given ref", async () => {
    const cwd = await gitdir({
      "package.json": JSON.stringify({
        private: true,
        workspaces: ["packages/*"],
      }),
      "packages/pkg-a/package.json": JSON.stringify({
        name: "pkg-a",
        version: "1.0.0",
      }),
      "packages/pkg-a/src/a.js": 'export default "a"',
      ".changeset/config.json": JSON.stringify({}),
    });

    await spawn("git", ["checkout", "-b", "new-branch"], { cwd });

    await fs.outputFile(
      path.join(cwd, "packages/pkg-a/a.js"),
      'export default "updated a"'
    );
    await writeChangeset(
      {
        summary: "This is a summary",
        releases: [{ name: "pkg-a", type: "minor" }],
      },
      cwd
    );
    await git.add(".", cwd);
    await git.commit("updated a", cwd);

    const spy = jest.spyOn(fs, "writeFile");

    await version(cwd, { since: "main" }, modifiedDefaultConfig);

    expect(getPkgJSON("pkg-a", spy.mock.calls)).toEqual(
      expect.objectContaining({ name: "pkg-a", version: "1.1.0" })
    );
  });
});
