/**
 * Shared utility functions and business logic
 */
import semverSatisfies from "semver/functions/satisfies";
import {
  DependencyType,
  ExperimentalOptions,
  VersionType,
} from "@changesets/types";

const bumpTypes = ["none", "patch", "minor", "major"];

/* Converts a bump type into a numeric level to indicate order */
function getBumpLevel(type: VersionType) {
  const level = bumpTypes.indexOf(type);
  if (level < 0) {
    throw new Error(`Unrecognised bump type ${type}`);
  }
  return level;
}

export function shouldUpdateDependencyBasedOnConfig(
  release: { version: string; type: VersionType },
  {
    depVersionRange,
    depType,
  }: {
    depVersionRange: string;
    depType: DependencyType;
  },
  {
    minReleaseType,
    onlyUpdatePeerDependentsWhenOutOfRange,
    updateInternalDependents,
  }: {
    minReleaseType: "patch" | "minor";
    onlyUpdatePeerDependentsWhenOutOfRange: ExperimentalOptions["onlyUpdatePeerDependentsWhenOutOfRange"];
    updateInternalDependents?: ExperimentalOptions["updateInternalDependents"];
  }
): boolean {
  if (!semverSatisfies(release.version, depVersionRange)) {
    // Dependencies leaving semver range should always be updated
    return true;
  }

  const minLevel = getBumpLevel(minReleaseType);
  let shouldUpdate = getBumpLevel(release.type) >= minLevel;

  if (depType === "peerDependencies") {
    shouldUpdate =
      !onlyUpdatePeerDependentsWhenOutOfRange ||
      updateInternalDependents === "always";
  }
  return shouldUpdate;
}
