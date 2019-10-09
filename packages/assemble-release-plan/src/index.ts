import {
  ReleasePlan,
  Workspace,
  Config,
  NewChangeset,
  PreState
} from "@changesets/types";
import determineDependents from "./determine-dependents";
import flattenReleases from "./flatten-releases";
import applyLinks from "./apply-links";
import { incrementVersion } from "./increment";

function assembleReleasePlan(
  changesets: NewChangeset[],
  workspaces: Workspace[],
  dependentsGraph: Map<string, string[]>,
  config: Config,
  preState?: PreState
): ReleasePlan {
  let updatedPreState: PreState | undefined =
    preState === undefined
      ? undefined
      : {
          ...preState,
          initialVersions: {
            ...preState.initialVersions
          },
          version: preState.version + 1
        };
  if (preState !== undefined) {
    workspaces = workspaces.map(workspace => {
      if (preState.initialVersions[workspace.name] === undefined) {
        preState.initialVersions[workspace.name] = workspace.config.version;
        return workspace;
      }
      return {
        ...workspace,
        config: {
          ...workspace.config,
          version: preState.initialVersions[workspace.name]
        }
      };
    });
  }
  // releases is, at this point a list of all packages we are going to releases,
  // flattened down to one release per package, having a reference back to their
  // changesets, and with a calculated new versions
  let releases = flattenReleases(changesets, workspaces);

  let releaseObjectValidated = false;
  while (releaseObjectValidated === false) {
    // The map passed in to determineDependents will be mutated
    let dependentAdded = determineDependents(
      releases,
      workspaces,
      dependentsGraph,
      updatedPreState
    );

    // The map passed in to determineDependents will be mutated
    let linksUpdated = applyLinks(releases, workspaces, config.linked);

    releaseObjectValidated = !linksUpdated && !dependentAdded;
  }

  return {
    changesets,
    releases: releases.map(incompleteRelease => {
      return {
        ...incompleteRelease,
        newVersion: incrementVersion(
          incompleteRelease.oldVersion,
          incompleteRelease.type,
          updatedPreState
        )!
      };
    }),
    preState: updatedPreState
  };
}

export default assembleReleasePlan;
