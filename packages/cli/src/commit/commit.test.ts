import { outdent } from "outdent";
import defaultCommitFunctions from "./index.ts";
import { NewChangeset, ReleasePlan } from "@changesets/types";

const simpleChangeset: NewChangeset = {
  summary: "This is a summary",
  releases: [{ name: "package-a", type: "minor" }],
  id: "abc123xy",
};

const simpleChangeset2: NewChangeset = {
  summary: "This is another summary",
  releases: [
    { name: "package-a", type: "patch" },
    { name: "package-b", type: "minor" },
  ],
  id: "abc123fh",
};

let simpleReleasePlan: ReleasePlan = {
  changesets: [simpleChangeset],
  releases: [
    {
      name: "package-a",
      type: "minor",
      oldVersion: "1.0.0",
      newVersion: "1.1.0",
      changesets: [simpleChangeset.id],
    },
  ],
  preState: undefined,
};

let secondReleasePlan: ReleasePlan = {
  changesets: [simpleChangeset, simpleChangeset2],
  releases: [
    {
      name: "package-a",
      type: "minor",
      oldVersion: "1.0.0",
      newVersion: "1.1.0",
      changesets: [simpleChangeset.id],
    },
    {
      name: "package-b",
      type: "minor",
      oldVersion: "1.0.0",
      newVersion: "1.1.0",
      changesets: [simpleChangeset2.id],
    },
  ],
  preState: undefined,
};

describe("defaultCommitFunctions", () => {
  const { getAddMessage, getVersionMessage } = defaultCommitFunctions;

  it("should handle a simple changeset", async () => {
    const commitStr = await getAddMessage(
      {
        summary: "test changeset summary commit",
        releases: [
          {
            name: "package-a",
            type: "minor",
          },
        ],
      },
      { skipCI: "version" }
    );
    expect(commitStr).toEqual(`docs(changeset): test changeset summary commit`);
  });

  it("should handle a simple changeset - skipCI", async () => {
    const commitStr = await getAddMessage(
      {
        summary: "test changeset summary commit",
        releases: [
          {
            name: "package-a",
            type: "minor",
          },
        ],
      },
      { skipCI: "add" }
    );
    expect(commitStr).toEqual(outdent`
        docs(changeset): test changeset summary commit

        [skip ci]

      `);
  });

  it("should handle a single simple releaseObject with one released package - skipCI", async () => {
    const commitStr = await getVersionMessage(simpleReleasePlan, {
      skipCI: "version",
    });
    expect(commitStr).toEqual(outdent`
      RELEASING: Releasing 1 package(s)

      Releases:
        package-a@1.1.0

      [skip ci]

      `);
  });

  it("should handle a single simple releaseObject with one released package", async () => {
    const commitStr = await getVersionMessage(simpleReleasePlan, {
      skipCI: false,
    });
    expect(commitStr).toEqual(outdent`
      RELEASING: Releasing 1 package(s)

      Releases:
        package-a@1.1.0

      `);
  });

  it("should handle a multiple releases from one changeset", async () => {
    let releasePlan: ReleasePlan = {
      changesets: [simpleChangeset, simpleChangeset2],
      releases: [
        {
          name: "package-a",
          type: "patch",
          oldVersion: "1.0.0",
          newVersion: "1.0.1",
          changesets: [simpleChangeset.id],
        },
        {
          name: "package-b",
          type: "minor",
          oldVersion: "1.0.0",
          newVersion: "1.1.0",
          changesets: [simpleChangeset2.id],
        },
      ],
      preState: undefined,
    };
    const commitStr = await getVersionMessage(releasePlan, {
      skipCI: "version",
    });
    expect(commitStr).toEqual(outdent`
      RELEASING: Releasing 2 package(s)

      Releases:
        package-a@1.0.1
        package-b@1.1.0

      [skip ci]

    `);
  });

  it("should handle a merging releases from multiple changesets", async () => {
    const commitStr = await getVersionMessage(secondReleasePlan, {
      skipCI: "version",
    });

    expect(commitStr).toEqual(outdent`
      RELEASING: Releasing 2 package(s)

      Releases:
        package-a@1.1.0
        package-b@1.1.0

      [skip ci]

    `);
  });

  it("should not mention unreleased devDependents in release commit message", async () => {
    const commitStr = await getVersionMessage(
      {
        changesets: [
          {
            id: "quick-lions-devour",
            summary: "Hey, let's have fun with testing!",
            releases: [
              { name: "pkg-a", type: "none" },
              { name: "pkg-b", type: "minor" },
            ],
          },
        ],
        releases: [
          {
            name: "pkg-a",
            type: "none",
            oldVersion: "1.0.0",
            newVersion: "1.0.0",
            changesets: ["quick-lions-devour"],
          },
          {
            name: "pkg-b",
            type: "minor",
            oldVersion: "1.0.0",
            newVersion: "1.1.0",
            changesets: ["quick-lions-devour"],
          },
        ],
        preState: undefined,
      },
      { skipCI: "version" }
    );

    expect(commitStr).toMatch("RELEASING: Releasing 1 package(s)");
    expect(commitStr).toMatch("pkg-b@1.1.0");
    expect(commitStr).not.toMatch("pkg-a");
  });
});
