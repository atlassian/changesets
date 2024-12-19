import { shouldUpdateDependencyBasedOnConfig } from "./utils";

describe("shouldUpdateDependencyBasedOnConfig", () => {
  it("should NOT update patch bumped dependencies which satisfy workspace version range", () => {
    const shouldUpdate = shouldUpdateDependencyBasedOnConfig(
      {
        version: "1.0.1",
        type: "patch",
      },
      {
        depVersionRange: "workspace:^1.0.0",
        depType: "dependencies",
      },
      {
        minReleaseType: "minor",
        onlyUpdatePeerDependentsWhenOutOfRange: false,
      }
    );
    expect(shouldUpdate).toBe(false);
  });
});
