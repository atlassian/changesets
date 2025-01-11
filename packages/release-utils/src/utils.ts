import { getPackages, Package } from "@changesets/get-packages";
// @ts-ignore
import mdastToString from "mdast-util-to-string";
import os from "os";
import remarkParse from "remark-parse";
import remarkStringify from "remark-stringify";
import spawn from "spawndamnit";
import unified from "unified";

export const BumpLevels = {
  dep: 0,
  patch: 1,
  minor: 2,
  major: 3,
} as const;

export async function getVersionsByDirectory(cwd: string) {
  let { packages } = await getPackages(cwd);
  return new Map(packages.map((x) => [x.dir, x.packageJson.version]));
}

export async function getChangedPackages(
  cwd: string,
  previousVersions: Map<string, string>
) {
  let { packages } = await getPackages(cwd);
  let changedPackages = new Set<Package>();

  for (let pkg of packages) {
    const previousVersion = previousVersions.get(pkg.dir);
    if (previousVersion !== pkg.packageJson.version) {
      changedPackages.add(pkg);
    }
  }

  return [...changedPackages];
}

export function getChangelogEntry(changelog: string, version: string) {
  let ast = unified().use(remarkParse).parse(changelog);

  let highestLevel: number = BumpLevels.dep;

  let nodes = ast.children as Array<any>;
  let headingStartInfo:
    | {
        index: number;
        depth: number;
      }
    | undefined;
  let endIndex: number | undefined;

  for (let i = 0; i < nodes.length; i++) {
    let node = nodes[i];
    if (node.type === "heading") {
      let stringified: string = mdastToString(node);
      let match = stringified.toLowerCase().match(/(major|minor|patch)/);
      if (match !== null) {
        let level = BumpLevels[match[0] as "major" | "minor" | "patch"];
        highestLevel = Math.max(level, highestLevel);
      }
      if (headingStartInfo === undefined && stringified === version) {
        headingStartInfo = {
          index: i,
          depth: node.depth,
        };
        continue;
      }
      if (
        endIndex === undefined &&
        headingStartInfo !== undefined &&
        headingStartInfo.depth === node.depth
      ) {
        endIndex = i;
        break;
      }
    }
  }
  if (headingStartInfo) {
    ast.children = (ast.children as any).slice(
      headingStartInfo.index + 1,
      endIndex
    );
  }
  return {
    content: unified().use(remarkStringify).stringify(ast),
    highestLevel,
  };
}

export async function execWithOutput(
  command: string,
  args: string[],
  options: { ignoreReturnCode?: boolean; cwd: string }
) {
  process.stdout.write(`Running: ${command} ${args.join(" ")}` + os.EOL);
  let childProcess = spawn(command, args, {
    cwd: options.cwd,
  });
  childProcess.on("stdout", (data) => process.stdout.write(data));
  childProcess.on("stderr", (data) => process.stderr.write(data));
  let result = await childProcess;
  if (!options?.ignoreReturnCode && result.code !== 0) {
    throw new Error(
      `The command "${command} ${args.join(" ")}" failed with code ${
        result.code
      }\n${result.stdout.toString("utf8")}\n${result.stderr.toString("utf8")}`
    );
  }
  return {
    code: result.code,
    stdout: result.stdout.toString("utf8"),
    stderr: result.stderr.toString("utf8"),
  };
}

export function sortChangelogEntries(
  a: { private: boolean; highestLevel: number },
  b: { private: boolean; highestLevel: number }
) {
  if (a.private === b.private) {
    return b.highestLevel - a.highestLevel;
  }
  if (a.private) {
    return 1;
  }
  return -1;
}
