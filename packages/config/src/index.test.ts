import { read, parse } from "./";
import jestInCase from "jest-in-case";
import * as logger from "@changesets/logger";
import { Config, WrittenConfig } from "@changesets/types";
import { Packages, getPackages } from "@manypkg/get-packages";
import { testdir } from "@changesets/test-utils";
import outdent from "outdent";

jest.mock("@changesets/logger");

type CorrectCase = {
  packages?: string[];
  input: WrittenConfig;
  output: Config;
};

let defaultPackages: Packages = {
  root: {
    packageJson: { name: "", version: "" },
    dir: "/",
  },
  packages: [],
  tool: "yarn",
};

const withPackages = (pkgNames: string[]) => ({
  ...defaultPackages,
  packages: pkgNames.map((pkgName) => ({
    packageJson: { name: pkgName, version: "" },
    dir: "dir",
  })),
});

test("read reads the config", async () => {
  let cwd = await testdir({
    ".changeset/config.json": JSON.stringify({
      changelog: false,
      commit: true,
    }),
  });
  let config = await read(cwd, defaultPackages);
  expect(config).toEqual({
    fixed: [],
    linked: [],
    changelog: false,
    commit: ["@changesets/cli/commit", { skipCI: "version" }],
    access: "restricted",
    baseBranch: "master",
    changedFilePatterns: ["**"],
    updateInternalDependencies: "patch",
    ignore: [],
    bumpVersionsWithWorkspaceProtocolOnly: false,
    privatePackages: {
      tag: false,
      version: true,
    },
    ___experimentalUnsafeOptions_WILL_CHANGE_IN_PATCH: {
      onlyUpdatePeerDependentsWhenOutOfRange: false,
      updateInternalDependents: "out-of-range",
    },
    snapshot: {
      useCalculatedVersion: false,
      prereleaseTemplate: null,
    },
  });
});

test("read can read config based on the passed in `cwd`", async () => {
  let cwd = await testdir({
    ".changeset/config.json": JSON.stringify({
      changelog: false,
      commit: true,
    }),
    "package.json": JSON.stringify({
      name: "testing",
      version: "0.0.0",
    }),
  });
  let config = await read(cwd);

  expect(config).toEqual({
    fixed: [],
    linked: [],
    changelog: false,
    commit: ["@changesets/cli/commit", { skipCI: "version" }],
    access: "restricted",
    baseBranch: "master",
    changedFilePatterns: ["**"],
    updateInternalDependencies: "patch",
    ignore: [],
    bumpVersionsWithWorkspaceProtocolOnly: false,
    privatePackages: {
      tag: false,
      version: true,
    },
    ___experimentalUnsafeOptions_WILL_CHANGE_IN_PATCH: {
      onlyUpdatePeerDependentsWhenOutOfRange: false,
      updateInternalDependents: "out-of-range",
    },
    snapshot: {
      useCalculatedVersion: false,
      prereleaseTemplate: null,
    },
  });
});

it("should not fail when validating ignored packages when some package depends on the root workspace", async () => {
  const cwd = await testdir({
    ".changeset/config.json": JSON.stringify({
      ignore: ["other-example"],
    }),
    "package.json": JSON.stringify({
      name: "zod-to-fields",
      version: "0.1.2",
    }),
    "pnpm-workspace.yaml": outdent`
          packages:
            - examples/*
        `,
    "examples/react/package.json": JSON.stringify({
      name: "react-example",
      private: true,
      version: "0.0.0",
      dependencies: {
        "zod-to-fields": "workspace:*",
      },
    }),
    "examples/other/package.json": JSON.stringify({
      name: "other-example",
      private: true,
      version: "0.0.0",
    }),
  });

  const packages = await getPackages(cwd);
  expect(() => read(cwd, packages)).not.toThrow();
});

let defaults: Config = {
  fixed: [],
  linked: [],
  changelog: ["@changesets/cli/changelog", null],
  commit: false,
  access: "restricted",
  baseBranch: "master",
  changedFilePatterns: ["**"],
  updateInternalDependencies: "patch",
  ignore: [],
  privatePackages: { version: true, tag: false },
  ___experimentalUnsafeOptions_WILL_CHANGE_IN_PATCH: {
    onlyUpdatePeerDependentsWhenOutOfRange: false,
    updateInternalDependents: "out-of-range",
  },
  snapshot: {
    useCalculatedVersion: false,
    prereleaseTemplate: null,
  },
  bumpVersionsWithWorkspaceProtocolOnly: false,
};

let correctCases: Record<string, CorrectCase> = {
  defaults: {
    input: {},
    output: defaults,
  },
  "changelog string": {
    input: {
      changelog: "some-module",
    },
    output: {
      ...defaults,
      changelog: ["some-module", null],
    },
  },
  "changelog false": {
    input: {
      changelog: false,
    },
    output: {
      ...defaults,
      changelog: false,
    },
  },
  "changelog tuple": {
    input: {
      changelog: ["some-module", { something: true }],
    },
    output: {
      ...defaults,
      changelog: ["some-module", { something: true }],
    },
  },
  "commit false": {
    input: {
      commit: false,
    },
    output: {
      ...defaults,
      commit: false,
    },
  },
  "commit true": {
    input: {
      commit: true,
    },
    output: {
      ...defaults,
      commit: ["@changesets/cli/commit", { skipCI: "version" }],
    },
  },
  "commit custom": {
    input: {
      commit: ["./some-module", { customOption: true }],
    },
    output: {
      ...defaults,
      commit: ["./some-module", { customOption: true }],
    },
  },
  "access private": {
    input: {
      access: "restricted",
    },
    output: {
      ...defaults,
      access: "restricted",
    },
  },
  "access public": {
    input: {
      access: "public",
    },
    output: {
      ...defaults,
      access: "public",
    },
  },
  changedFilePatterns: {
    input: {
      changedFilePatterns: ["src/**"],
    },
    output: {
      ...defaults,
      changedFilePatterns: ["src/**"],
    },
  },
  fixed: {
    input: {
      fixed: [["pkg-a", "pkg-b"]],
    },
    output: {
      ...defaults,
      fixed: [["pkg-a", "pkg-b"]],
    },
  },
  fixedWithGlobs: {
    packages: [
      "pkg-a",
      "pkg-b",
      "@pkg/a",
      "@pkg/b",
      "@pkg-other/a",
      "@pkg-other/b",
    ],
    input: {
      fixed: [["pkg-*", "@pkg/*"], ["@pkg-other/a"]],
    },
    output: {
      ...defaults,
      fixed: [["pkg-a", "pkg-b", "@pkg/a", "@pkg/b"], ["@pkg-other/a"]],
    },
  },
  fixedWithGlobsAndExclusion: {
    packages: [
      "pkg-a",
      "pkg-b",
      "@pkg/a",
      "@pkg/b",
      "@pkg-other/a",
      "@pkg-other/b",
    ],
    input: {
      fixed: [["pkg-*", "!pkg-b", "@pkg/*"], ["@pkg-other/a"]],
    },
    output: {
      ...defaults,
      fixed: [["pkg-a", "@pkg/a", "@pkg/b"], ["@pkg-other/a"]],
    },
  },
  linked: {
    input: {
      linked: [["pkg-a", "pkg-b"]],
    },
    output: {
      ...defaults,
      linked: [["pkg-a", "pkg-b"]],
    },
  },
  linkedWithGlobs: {
    packages: [
      "pkg-a",
      "pkg-b",
      "@pkg/a",
      "@pkg/b",
      "@pkg-other/a",
      "@pkg-other/b",
    ],
    input: {
      linked: [["pkg-*", "@pkg/*"], ["@pkg-other/a"]],
    },
    output: {
      ...defaults,
      linked: [["pkg-a", "pkg-b", "@pkg/a", "@pkg/b"], ["@pkg-other/a"]],
    },
  },
  linkedWithGlobsAndExclusion: {
    packages: [
      "pkg-a",
      "pkg-b",
      "@pkg/a",
      "@pkg/b",
      "@pkg-other/a",
      "@pkg-other/b",
    ],
    input: {
      linked: [["pkg-*", "!pkg-b", "@pkg/*"], ["@pkg-other/a"]],
    },
    output: {
      ...defaults,
      linked: [["pkg-a", "@pkg/a", "@pkg/b"], ["@pkg-other/a"]],
    },
  },
  "update internal dependencies minor": {
    input: {
      updateInternalDependencies: "minor",
    },
    output: {
      ...defaults,
      updateInternalDependencies: "minor",
    },
  },
  "update internal dependencies patch": {
    input: {
      updateInternalDependencies: "patch",
    },
    output: {
      ...defaults,
      updateInternalDependencies: "patch",
    },
  },
  ignore: {
    input: {
      ignore: ["pkg-a", "pkg-b"],
    },
    output: {
      ...defaults,
      ignore: ["pkg-a", "pkg-b"],
    },
  },
  ignoreWithGlobs: {
    packages: ["pkg-a", "pkg-b", "@pkg/a", "@pkg/b"],
    input: {
      ignore: ["pkg-*", "@pkg/*"],
    },
    output: {
      ...defaults,
      ignore: ["pkg-a", "pkg-b", "@pkg/a", "@pkg/b"],
    },
  },
  ignoreWithGlobsAndExclusions: {
    packages: ["pkg-a", "pkg-b", "@pkg/a", "@pkg/b"],
    input: {
      ignore: ["pkg-*", "!pkg-b", "@pkg/*"],
    },
    output: {
      ...defaults,
      ignore: ["pkg-a", "@pkg/a", "@pkg/b"],
    },
  },
  privatePackagesFalseDisablesAll: {
    input: {
      privatePackages: false,
    },
    output: {
      ...defaults,
      privatePackages: {
        version: false,
        tag: false,
      },
    },
  },
  updateInternalDependents: {
    input: {
      ___experimentalUnsafeOptions_WILL_CHANGE_IN_PATCH: {
        updateInternalDependents: "always",
      },
    },
    output: {
      ...defaults,
      ___experimentalUnsafeOptions_WILL_CHANGE_IN_PATCH: {
        ...defaults.___experimentalUnsafeOptions_WILL_CHANGE_IN_PATCH,
        updateInternalDependents: "always",
      },
    },
  },
  experimental_deprecated_useCalculatedVersionInSnapshot: {
    input: {
      ___experimentalUnsafeOptions_WILL_CHANGE_IN_PATCH: {
        useCalculatedVersionForSnapshots: true,
      },
    },
    output: {
      ...defaults,
      snapshot: {
        useCalculatedVersion: true,
        prereleaseTemplate: null,
      },
    },
  },
};

jestInCase(
  "parse",
  (testCase) => {
    expect(
      parse(
        testCase.input,
        withPackages(testCase.packages || ["pkg-a", "pkg-b"])
      )
    ).toEqual(testCase.output);
  },
  correctCases
);

let unsafeParse = parse as any;

describe("parser errors", () => {
  test("changelog invalid value", () => {
    expect(() => {
      unsafeParse({ changelog: {} }, defaultPackages);
    }).toThrowErrorMatchingInlineSnapshot(`
      "Some errors occurred when validating the changesets config:
      The \`changelog\` option is set as {} when the only valid values are undefined, false, a module path(e.g. "@changesets/cli/changelog" or "./some-module") or a tuple with a module path and config for the changelog generator(e.g. ["@changesets/cli/changelog", { someOption: true }])"
    `);
  });
  test("changelog array with 3 values", () => {
    expect(() => {
      unsafeParse(
        { changelog: ["some-module", "something", "other"] },
        defaultPackages
      );
    }).toThrowErrorMatchingInlineSnapshot(`
      "Some errors occurred when validating the changesets config:
      The \`changelog\` option is set as [
        "some-module",
        "something",
        "other"
      ] when the only valid values are undefined, false, a module path(e.g. "@changesets/cli/changelog" or "./some-module") or a tuple with a module path and config for the changelog generator(e.g. ["@changesets/cli/changelog", { someOption: true }])"
    `);
  });
  test("changelog array with first value not string", () => {
    expect(() => {
      unsafeParse({ changelog: [false, "something"] }, defaultPackages);
    }).toThrowErrorMatchingInlineSnapshot(`
      "Some errors occurred when validating the changesets config:
      The \`changelog\` option is set as [
        false,
        "something"
      ] when the only valid values are undefined, false, a module path(e.g. "@changesets/cli/changelog" or "./some-module") or a tuple with a module path and config for the changelog generator(e.g. ["@changesets/cli/changelog", { someOption: true }])"
    `);
  });
  test("access other string", () => {
    expect(() => {
      unsafeParse({ access: "something" }, defaultPackages);
    }).toThrowErrorMatchingInlineSnapshot(`
      "Some errors occurred when validating the changesets config:
      The \`access\` option is set as "something" when the only valid values are undefined, "public" or "restricted""
    `);
  });
  test("commit invalid value", () => {
    expect(() => {
      unsafeParse({ commit: {} }, defaultPackages);
    }).toThrowErrorMatchingInlineSnapshot(`
      "Some errors occurred when validating the changesets config:
      The \`commit\` option is set as {} when the only valid values are undefined or a boolean or a module path (e.g. "@changesets/cli/commit" or "./some-module") or a tuple with a module path and config for the commit message generator (e.g. ["@changesets/cli/commit", { "skipCI": "version" }])"
    `);
  });
  describe("fixed", () => {
    test("non-array", () => {
      expect(() => {
        unsafeParse({ fixed: {} }, defaultPackages);
      }).toThrowErrorMatchingInlineSnapshot(`
        "Some errors occurred when validating the changesets config:
        The \`fixed\` option is set as {} when the only valid values are undefined or an array of arrays of package names"
      `);
    });
    test("array of non array", () => {
      expect(() => {
        unsafeParse({ fixed: [{}] }, defaultPackages);
      }).toThrowErrorMatchingInlineSnapshot(`
        "Some errors occurred when validating the changesets config:
        The \`fixed\` option is set as [
          {}
        ] when the only valid values are undefined or an array of arrays of package names"
      `);
    });
    test("array of array of non-string", () => {
      expect(() => {
        unsafeParse({ fixed: [[{}]] }, defaultPackages);
      }).toThrowErrorMatchingInlineSnapshot(`
        "Some errors occurred when validating the changesets config:
        The \`fixed\` option is set as [
          [
            {}
          ]
        ] when the only valid values are undefined or an array of arrays of package names"
      `);
    });
    test("package that does not exist", () => {
      expect(() => {
        parse({ fixed: [["not-existing"]] }, defaultPackages);
      }).toThrowErrorMatchingInlineSnapshot(`
        "Some errors occurred when validating the changesets config:
        The package or glob expression "not-existing" specified in the \`fixed\` option does not match any package in the project. You may have misspelled the package name or provided an invalid glob expression. Note that glob expressions must be defined according to https://www.npmjs.com/package/micromatch"
      `);
    });
    test("package that does not exist (using glob expressions)", () => {
      expect(() => {
        parse({ fixed: [["pkg-a", "foo/*"]] }, withPackages(["pkg-a"]));
      }).toThrowErrorMatchingInlineSnapshot(`
        "Some errors occurred when validating the changesets config:
        The package or glob expression "foo/*" specified in the \`fixed\` option does not match any package in the project. You may have misspelled the package name or provided an invalid glob expression. Note that glob expressions must be defined according to https://www.npmjs.com/package/micromatch"
      `);
    });
    test("package in two fixed groups", () => {
      expect(() => {
        parse({ fixed: [["pkg-a"], ["pkg-a"]] }, withPackages(["pkg-a"]));
      }).toThrowErrorMatchingInlineSnapshot(`
        "Some errors occurred when validating the changesets config:
        The package "pkg-a" is defined in multiple sets of fixed packages. Packages can only be defined in a single set of fixed packages. If you are using glob expressions, make sure that they are valid according to https://www.npmjs.com/package/micromatch"
      `);
    });
    test("package in two fixed groups (using glob expressions)", () => {
      expect(() => {
        parse(
          { fixed: [["pkg-*"], ["pkg-*"]] },
          withPackages(["pkg-a", "pkg-b"])
        );
      }).toThrowErrorMatchingInlineSnapshot(`
        "Some errors occurred when validating the changesets config:
        The package "pkg-a" is defined in multiple sets of fixed packages. Packages can only be defined in a single set of fixed packages. If you are using glob expressions, make sure that they are valid according to https://www.npmjs.com/package/micromatch
        The package "pkg-b" is defined in multiple sets of fixed packages. Packages can only be defined in a single set of fixed packages. If you are using glob expressions, make sure that they are valid according to https://www.npmjs.com/package/micromatch"
      `);
    });
  });

  describe("linked", () => {
    test("non-array", () => {
      expect(() => {
        unsafeParse({ linked: {} }, defaultPackages);
      }).toThrowErrorMatchingInlineSnapshot(`
        "Some errors occurred when validating the changesets config:
        The \`linked\` option is set as {} when the only valid values are undefined or an array of arrays of package names"
      `);
    });
    test("array of non array", () => {
      expect(() => {
        unsafeParse({ linked: [{}] }, defaultPackages);
      }).toThrowErrorMatchingInlineSnapshot(`
        "Some errors occurred when validating the changesets config:
        The \`linked\` option is set as [
          {}
        ] when the only valid values are undefined or an array of arrays of package names"
      `);
    });
    test("array of array of non-string", () => {
      expect(() => {
        unsafeParse({ linked: [[{}]] }, defaultPackages);
      }).toThrowErrorMatchingInlineSnapshot(`
        "Some errors occurred when validating the changesets config:
        The \`linked\` option is set as [
          [
            {}
          ]
        ] when the only valid values are undefined or an array of arrays of package names"
      `);
    });
    test("package that does not exist", () => {
      expect(() => {
        parse({ linked: [["not-existing"]] }, defaultPackages);
      }).toThrowErrorMatchingInlineSnapshot(`
        "Some errors occurred when validating the changesets config:
        The package or glob expression "not-existing" specified in the \`linked\` option does not match any package in the project. You may have misspelled the package name or provided an invalid glob expression. Note that glob expressions must be defined according to https://www.npmjs.com/package/micromatch"
      `);
    });
    test("package that does not exist (using glob expressions)", () => {
      expect(() => {
        parse({ linked: [["pkg-a", "foo/*"]] }, withPackages(["pkg-a"]));
      }).toThrowErrorMatchingInlineSnapshot(`
        "Some errors occurred when validating the changesets config:
        The package or glob expression "foo/*" specified in the \`linked\` option does not match any package in the project. You may have misspelled the package name or provided an invalid glob expression. Note that glob expressions must be defined according to https://www.npmjs.com/package/micromatch"
      `);
    });
    test("package in two linked groups", () => {
      expect(() => {
        parse({ linked: [["pkg-a"], ["pkg-a"]] }, withPackages(["pkg-a"]));
      }).toThrowErrorMatchingInlineSnapshot(`
        "Some errors occurred when validating the changesets config:
        The package "pkg-a" is defined in multiple sets of linked packages. Packages can only be defined in a single set of linked packages. If you are using glob expressions, make sure that they are valid according to https://www.npmjs.com/package/micromatch"
      `);
    });
    test("package in two linked groups (using glob expressions)", () => {
      expect(() => {
        parse(
          { linked: [["pkg-*"], ["pkg-*"]] },
          withPackages(["pkg-a", "pkg-b"])
        );
      }).toThrowErrorMatchingInlineSnapshot(`
        "Some errors occurred when validating the changesets config:
        The package "pkg-a" is defined in multiple sets of linked packages. Packages can only be defined in a single set of linked packages. If you are using glob expressions, make sure that they are valid according to https://www.npmjs.com/package/micromatch
        The package "pkg-b" is defined in multiple sets of linked packages. Packages can only be defined in a single set of linked packages. If you are using glob expressions, make sure that they are valid according to https://www.npmjs.com/package/micromatch"
      `);
    });
  });
  test("access private warns and sets to restricted", () => {
    let config = unsafeParse({ access: "private" }, defaultPackages);
    expect(config).toEqual(defaults);
    expect(logger.warn).toBeCalledWith(
      'The `access` option is set as "private", but this is actually not a valid value - the correct form is "restricted".'
    );
  });
  test("updateInternalDependencies not patch or minor", () => {
    expect(() => {
      unsafeParse({ updateInternalDependencies: "major" }, defaultPackages);
    }).toThrowErrorMatchingInlineSnapshot(`
      "Some errors occurred when validating the changesets config:
      The \`updateInternalDependencies\` option is set as "major" but can only be 'patch' or 'minor'"
    `);
  });
  test("ignore non-array", () => {
    expect(() => unsafeParse({ ignore: "string value" }, defaultPackages))
      .toThrowErrorMatchingInlineSnapshot(`
      "Some errors occurred when validating the changesets config:
      The \`ignore\` option is set as "string value" when the only valid values are undefined or an array of package names"
    `);
  });
  test("ignore array of non-string", () => {
    expect(() => unsafeParse({ ignore: [123, "pkg-a"] }, defaultPackages))
      .toThrowErrorMatchingInlineSnapshot(`
      "Some errors occurred when validating the changesets config:
      The \`ignore\` option is set as [
        123,
        "pkg-a"
      ] when the only valid values are undefined or an array of package names"
    `);
  });
  test("ignore package that does not exist", () => {
    expect(() => unsafeParse({ ignore: ["pkg-a"] }, defaultPackages))
      .toThrowErrorMatchingInlineSnapshot(`
      "Some errors occurred when validating the changesets config:
      The package or glob expression "pkg-a" is specified in the \`ignore\` option but it is not found in the project. You may have misspelled the package name or provided an invalid glob expression. Note that glob expressions must be defined according to https://www.npmjs.com/package/micromatch"
    `);
  });
  test("ignore package that does not exist (using glob expressions)", () => {
    expect(() => unsafeParse({ ignore: ["pkg-*"] }, defaultPackages))
      .toThrowErrorMatchingInlineSnapshot(`
      "Some errors occurred when validating the changesets config:
      The package or glob expression "pkg-*" is specified in the \`ignore\` option but it is not found in the project. You may have misspelled the package name or provided an invalid glob expression. Note that glob expressions must be defined according to https://www.npmjs.com/package/micromatch"
    `);
  });
  test("ignore missing dependent packages", async () => {
    expect(() =>
      unsafeParse(
        { ignore: ["pkg-b"] },
        {
          ...defaultPackages,
          packages: [
            {
              packageJson: {
                name: "pkg-a",
                version: "1.0.0",
                dependencies: { "pkg-b": "1.0.0" },
              },
              dir: "dir",
            },
            {
              packageJson: { name: "pkg-b", version: "1.0.0" },
              dir: "dir",
            },
          ],
        }
      )
    ).toThrowErrorMatchingInlineSnapshot(`
      "Some errors occurred when validating the changesets config:
      The package "pkg-a" depends on the ignored package "pkg-b", but "pkg-a" is not being ignored. Please add "pkg-a" to the \`ignore\` option."
    `);
  });

  test("onlyUpdatePeerDependentsWhenOutOfRange non-boolean", () => {
    expect(() => {
      unsafeParse(
        {
          ___experimentalUnsafeOptions_WILL_CHANGE_IN_PATCH: {
            onlyUpdatePeerDependentsWhenOutOfRange: "not true",
          },
        },
        defaultPackages
      );
    }).toThrowErrorMatchingInlineSnapshot(`
      "Some errors occurred when validating the changesets config:
      The \`onlyUpdatePeerDependentsWhenOutOfRange\` option is set as "not true" when the only valid values are undefined or a boolean"
    `);
  });

  test("snapshot.useCalculatedVersion non-boolean", () => {
    expect(() => {
      unsafeParse(
        {
          snapshot: {
            useCalculatedVersion: "not true",
          },
        },
        defaultPackages
      );
    }).toThrowErrorMatchingInlineSnapshot(`
      "Some errors occurred when validating the changesets config:
      The \`snapshot.useCalculatedVersion\` option is set as "not true" when the only valid values are undefined or a boolean"
    `);
  });

  test("Experimental useCalculatedVersionForSnapshots non-boolean", () => {
    expect(() => {
      unsafeParse(
        {
          ___experimentalUnsafeOptions_WILL_CHANGE_IN_PATCH: {
            useCalculatedVersionForSnapshots: "not true",
          },
        },
        defaultPackages
      );
    }).toThrowErrorMatchingInlineSnapshot(`
      "Some errors occurred when validating the changesets config:
      The \`useCalculatedVersionForSnapshots\` option is set as "not true" when the only valid values are undefined or a boolean"
    `);
  });

  test("changed files patterns - non-array", () => {
    expect(() => unsafeParse({ changedFilePatterns: false }, defaultPackages))
      .toThrowErrorMatchingInlineSnapshot(`
      "Some errors occurred when validating the changesets config:
      The \`changedFilePatterns\` option is set as false but the \`changedFilePatterns\` option can only be set as an array of strings"
    `);
  });

  test("changed files patterns - non-string element", () => {
    expect(() =>
      unsafeParse({ changedFilePatterns: ["src/**", 100] }, defaultPackages)
    ).toThrowErrorMatchingInlineSnapshot(`
      "Some errors occurred when validating the changesets config:
      The \`changedFilePatterns\` option is set as [
        "src/**",
        100
      ] but the \`changedFilePatterns\` option can only be set as an array of strings"
    `);
  });
});
