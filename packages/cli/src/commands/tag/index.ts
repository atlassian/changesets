import * as git from "@changesets/git";
import { getPackages } from "@manypkg/get-packages";
import { log } from "@changesets/logger";

export default async function run(cwd: string) {
  const { packages, tool } = await getPackages(cwd);

  const allExistingTags = await git.getAllTags(cwd);

  for (const pkg of packages) {
    const tag =
      tool.type !== "root"
        ? `${pkg.packageJson.name}@${pkg.packageJson.version}`
        : `v${pkg.packageJson.version}`;

    if (allExistingTags.has(tag)) {
      log("Skipping tag (already exists): ", tag);
    } else {
      log("New tag: ", tag);
      await git.tag(tag, cwd);
    }
  }
}
