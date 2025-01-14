import { ExitError } from "@changesets/errors";
import { error, info, warn } from "@changesets/logger";
import { AccessType, PackageJSON } from "@changesets/types";
import pLimit from "p-limit";
import { detect } from "package-manager-detector";
import pc from "picocolors";
import spawn from "spawndamnit";
import semverParse from "semver/functions/parse";
import { askQuestion } from "../../utils/cli-utilities";
import { isCI } from "ci-info";
import { TwoFactorState } from "../../utils/types";
import { getLastJsonObjectFromString } from "../../utils/getLastJsonObjectFromString";

interface PublishOptions {
  cwd: string;
  publishDir: string;
  access: AccessType;
  tag: string;
}

interface PreStateType{
  mode: string;
  tag:string;
}

const npmRequestLimit = pLimit(40);
const npmPublishLimit = pLimit(10);

function jsonParse(input: string) {
  try {
    return JSON.parse(input);
  } catch (err) {
    if (err instanceof SyntaxError) {
      console.error("error parsing json:", input);
    }
    throw err;
  }
}

function getCorrectRegistry(packageJson?: PackageJSON): string {
  const registry =
    packageJson?.publishConfig?.registry ?? process.env.npm_config_registry;

  return !registry || registry === "https://registry.yarnpkg.com"
    ? "https://registry.npmjs.org"
    : registry;
}

async function getPublishTool(
  cwd: string
): Promise<{ name: "npm" } | { name: "pnpm"; shouldAddNoGitChecks: boolean }> {
  const pm = await detect({ cwd });
  if (!pm || pm.name !== "pnpm") return { name: "npm" };
  try {
    let result = await spawn("pnpm", ["--version"], { cwd });
    let version = result.stdout.toString().trim();
    let parsed = semverParse(version);
    return {
      name: "pnpm",
      shouldAddNoGitChecks:
        parsed?.major === undefined ? false : parsed.major >= 5,
    };
  } catch (e) {
    return {
      name: "pnpm",
      shouldAddNoGitChecks: false,
    };
  }
}

export async function getTokenIsRequired() {
  // Due to a super annoying issue in yarn, we have to manually override this env variable
  // See: https://github.com/yarnpkg/yarn/issues/2935#issuecomment-355292633
  const envOverride = {
    npm_config_registry: getCorrectRegistry(),
  };
  let result = await spawn("npm", ["profile", "get", "--json"], {
    env: Object.assign({}, process.env, envOverride),
  });
  if (result.code !== 0) {
    error(
      "error while checking if token is required",
      result.stderr.toString().trim() || result.stdout.toString().trim()
    );
    return false;
  }
  let json = jsonParse(result.stdout.toString());
  if (json.error || !json.tfa || !json.tfa.mode) {
    return false;
  }
  return json.tfa.mode === "auth-and-writes";
}

export function getPackageInfo(packageJson: PackageJSON, preState?: PreStateType) {
  return npmRequestLimit(async () => {
    info(`npm info ${packageJson.name}`);

    // Due to a couple of issues with yarnpkg, we also want to override the npm registry when doing
    // npm info.
    // Issues: We sometimes get back cached responses, i.e old data about packages which causes
    // `publish` to behave incorrectly. It can also cause issues when publishing private packages
    // as they will always give a 404, which will tell `publish` to always try to publish.
    // See: https://github.com/yarnpkg/yarn/issues/2935#issuecomment-355292633
    if (preState && preState.mode === "pre") {
      let result = await spawn("npm", ["info", packageJson.name, "--registry", getCorrectRegistry(packageJson), "--json"]); // Github package registry returns empty string when calling npm info
      let resultPre = await spawn("npm", ["info", packageJson.name + "@" + preState.tag, "--registry", getCorrectRegistry(packageJson), "--json"]); // Github package registry returns empty string when calling npm info
      // for a non-existent package instead of a E404

      if (result.stdout.toString() === "" && resultPre.stdout.toString() === "") {
        return {
          error: {
            code: "E404"
          }
        };
      }
      return result.stdout.toString() !== "" ? jsonParse(result.stdout.toString()) : jsonParse(resultPre.stdout.toString());
    } else {
      let result = await spawn("npm", [
        "info",
        packageJson.name,
        "--registry",
        getCorrectRegistry(packageJson),
        "--json",
      ]);

      // Github package registry returns empty string when calling npm info
      // for a non-existent package instead of a E404
      if (result.stdout.toString() === "") {
        return {
          error: {
            code: "E404",
          },
        };
      }
      return jsonParse(result.stdout.toString());
    }
  });
}

export async function infoAllow404(packageJson: PackageJSON, preState?: PreStateType) {
  let pkgInfo = await getPackageInfo(packageJson, preState);
  if (pkgInfo.error?.code === "E404") {
    warn(`Received 404 for npm info ${pc.cyan(`"${packageJson.name}"`)}`);
    return { published: false, pkgInfo: {} };
  }
  if (pkgInfo.error) {
    error(
      `Received an unknown error code: ${
        pkgInfo.error.code
      } for npm info ${pc.cyan(`"${packageJson.name}"`)}`
    );
    error(pkgInfo.error.summary);
    if (pkgInfo.error.detail) error(pkgInfo.error.detail);

    throw new ExitError(1);
  }
  return { published: true, pkgInfo };
}

let otpAskLimit = pLimit(1);

let askForOtpCode = (twoFactorState: TwoFactorState) =>
  otpAskLimit(async () => {
    if (twoFactorState.token !== null) return twoFactorState.token;
    info(
      "This operation requires a one-time password from your authenticator."
    );

    let val = await askQuestion("Enter one-time password:");
    twoFactorState.token = val;
    return val;
  });

export let getOtpCode = async (twoFactorState: TwoFactorState) => {
  if (twoFactorState.token !== null) {
    return twoFactorState.token;
  }
  return askForOtpCode(twoFactorState);
};

// we have this so that we can do try a publish again after a publish without
// the call being wrapped in the npm request limit and causing the publishes to potentially never run
async function internalPublish(
  pkgName: string,
  opts: PublishOptions,
  twoFactorState: TwoFactorState
): Promise<{ published: boolean }> {
  let publishTool = await getPublishTool(opts.cwd);
  let publishFlags = opts.access ? ["--access", opts.access] : [];
  publishFlags.push("--tag", opts.tag);

  if ((await twoFactorState.isRequired) && !isCI) {
    let otpCode = await getOtpCode(twoFactorState);
    publishFlags.push("--otp", otpCode);
  }
  if (publishTool.name === "pnpm" && publishTool.shouldAddNoGitChecks) {
    publishFlags.push("--no-git-checks");
  }

  // Due to a super annoying issue in yarn, we have to manually override this env variable
  // See: https://github.com/yarnpkg/yarn/issues/2935#issuecomment-355292633
  const envOverride = {
    npm_config_registry: getCorrectRegistry(),
  };
  let { code, stdout, stderr } =
    publishTool.name === "pnpm"
      ? await spawn("pnpm", ["publish", "--json", ...publishFlags], {
          env: Object.assign({}, process.env, envOverride),
          cwd: opts.cwd,
        })
      : await spawn(
          publishTool.name,
          ["publish", opts.publishDir, "--json", ...publishFlags],
          {
            env: Object.assign({}, process.env, envOverride),
          }
        );
  if (code !== 0) {
    // NPM's --json output is included alongside the `prepublish` and `postpublish` output in terminal
    // We want to handle this as best we can but it has some struggles:
    // - output of those lifecycle scripts can contain JSON
    // - npm7 has switched to printing `--json` errors to stderr (https://github.com/npm/cli/commit/1dbf0f9bb26ba70f4c6d0a807701d7652c31d7d4)
    // Note that the `--json` output is always printed at the end so this should work
    let json =
      getLastJsonObjectFromString(stderr.toString()) ||
      getLastJsonObjectFromString(stdout.toString());

    if (json?.error) {
      // The first case is no 2fa provided, the second is when the 2fa is wrong (timeout or wrong words)
      if (
        (json.error.code === "EOTP" ||
          (json.error.code === "E401" &&
            json.error.detail.includes("--otp=<code>"))) &&
        !isCI
      ) {
        if (twoFactorState.token !== null) {
          // the current otp code must be invalid since it errored
          twoFactorState.token = null;
        }
        // just in case this isn't already true
        twoFactorState.isRequired = Promise.resolve(true);
        return internalPublish(pkgName, opts, twoFactorState);
      }
      error(
        `an error occurred while publishing ${pkgName}: ${json.error.code}`,
        json.error.summary,
        json.error.detail ? "\n" + json.error.detail : ""
      );
    }

    error(stderr.toString() || stdout.toString());
    return { published: false };
  }
  return { published: true };
}

export function publish(
  pkgName: string,
  opts: PublishOptions,
  twoFactorState: TwoFactorState
): Promise<{ published: boolean }> {
  // If there are many packages to be published, it's better to limit the
  // concurrency to avoid unwanted errors, for example from npm.
  return npmRequestLimit(() =>
    npmPublishLimit(() => internalPublish(pkgName, opts, twoFactorState))
  );
}
