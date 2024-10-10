/* eslint-disable import/no-extraneous-dependencies */
import git from "@changesets/git";

console.log("🦋 New tag: v1.0.0");

git.tag("v1.0.0", process.cwd());
