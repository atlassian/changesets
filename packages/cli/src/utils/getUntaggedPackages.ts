import * as git from "@changesets/git";
import { Package, Tool } from "@changesets/get-packages";
import { PublishedResult } from "../commands/publish/publishPackages";

export async function getUntaggedPackages(
  packages: Package[],
  cwd: string,
  tool: Tool
) {
  const packageWithTags = await Promise.all(
    packages.map(async (pkg) => {
      const tagName =
        tool === "root"
          ? `v${pkg.packageJson.version}`
          : `${pkg.packageJson.name}@${pkg.packageJson.version}`;
      const isMissingTag = !(
        (await git.tagExists(tagName, cwd)) ||
        (await git.remoteTagExists(tagName))
      );

      return { pkg, isMissingTag };
    })
  );

  const untagged: PublishedResult[] = [];

  for (const packageWithTag of packageWithTags) {
    if (packageWithTag.isMissingTag) {
      untagged.push({
        name: packageWithTag.pkg.packageJson.name,
        newVersion: packageWithTag.pkg.packageJson.version,
        published: false,
      });
    }
  }

  return untagged;
}
