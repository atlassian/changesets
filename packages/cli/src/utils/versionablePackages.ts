import { Config } from "@changesets/types";
import { getChangedPackagesSinceRef } from "@changesets/git";
import { Package } from "@manypkg/get-packages";

function isVersionablePackage(
  { packageJson }: Package,
  {
    ignoredPackages,
    ignorePrivatePackages,
  }: {
    ignoredPackages: Set<string>;
    ignorePrivatePackages: boolean;
  }
) {
  if (ignoredPackages.has(packageJson.name)) {
    return false;
  }

  if (packageJson.private && !ignorePrivatePackages) {
    return false;
  }

  const hasVersionField = !!packageJson.version;
  return hasVersionField;
}

export function filterVersionablePackages(config: Config, packages: Package[]) {
  const options = {
    ignoredPackages: new Set(config.ignore),
    ignorePrivatePackages: config.privatePackages.version,
  };
  return packages.filter((pkg) => isVersionablePackage(pkg, options));
}

export function filterTaggablePackages(config: Config, packages: Package[]) {
  const options = {
    ignoredPackages: new Set(config.ignore),
    ignorePrivatePackages: config.privatePackages.tag,
  };
  return packages.filter((pkg) => isVersionablePackage(pkg, options));
}

export async function getVersionableChangedPackages(
  config: Config,
  {
    cwd,
    ref,
  }: {
    cwd: string;
    ref?: string;
  }
) {
  const changedPackages = await getChangedPackagesSinceRef({
    ref: ref ?? config.baseBranch,
    changedFilePatterns: config.changedFilePatterns,
    cwd,
  });
  return filterVersionablePackages(config, changedPackages);
}
