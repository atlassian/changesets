import * as git from "@changesets/git";
import { Package, Tool } from "@manypkg/get-packages";
import { PublishedResult } from "./publishPackages";

export async function getUntaggedPrivatePackages(
  privatePackages: Package[],
  cwd: string,
  tool: Tool
) {
  const packageWithTags = await Promise.all(
    privatePackages.map(async (privatePkg) => {
      const tagName =
        tool.type === "root"
          ? `v${privatePkg.packageJson.version}`
          : `${privatePkg.packageJson.name}@${privatePkg.packageJson.version}`;
      const isMissingTag = !(
        (await git.tagExists(tagName, cwd)) ||
        (await git.remoteTagExists(tagName))
      );

      return { pkg: privatePkg, isMissingTag };
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
