import { ExitError, InternalError } from "@changesets/errors";
import { error } from "@changesets/logger";
import mri from "mri";
import { format } from "util";
import { run } from "./run";

const args = process.argv.slice(2);

const parsed = mri(args, {
  boolean: ["sinceMaster", "verbose", "empty", "open", "gitTag", "snapshot"],
  string: [
    "output",
    "otp",
    "since",
    "ignore",
    "tag",
    "snapshot",
    "snapshotPrereleaseTemplate",
    "filter",
  ],
  alias: {
    // Short flags
    v: "verbose",
    o: "output",
    // Support kebab-case flags
    "since-master": "sinceMaster",
    "git-tag": "gitTag",
    "snapshot-prerelease-template": "snapshotPrereleaseTemplate",
    // Deprecated flags
    "update-changelog": "updateChangelog",
    "is-public": "isPublic",
    "skip-c-i": "skipCI",
  },
  default: {
    gitTag: true,
  },
});

// `mri` doesn't handle mixed boolean and strings well. It'll always try to coerce it as
// a string even if only `--snapshot` is passed. We check here if this was the case and
// try to coerce it as a boolean
if (parsed.snapshot === "" && args[args.indexOf("--snapshot") + 1] !== "") {
  parsed.snapshot = true;
}

// Help message should only be shown if it's the only argument passed
if (parsed.help && args.length === 1) {
  console.log(
    `
  Organise your package versioning and publishing to make both contributors and maintainers happy

  Usage
    $ changeset [command]
  Commands
    init
    add [--empty] [--open]
    version [--ignore] [--snapshot <?name>] [--snapshot-prerelease-template <template>]
    publish [--tag <name>] [--otp <code>] [--no-git-tag] [--filter <name>]
    status [--since <branch>] [--verbose] [--output JSON_FILE.json]
    pre <enter|exit> <tag>
    tag
    `
  );
  process.exit(0);
}

// Version should only be shown if it's the only argument passed
if (parsed.version && args.length === 1) {
  // eslint-disable-next-line import/no-extraneous-dependencies
  console.log(require("@changesets/cli/package.json").version);
  process.exit(0);
}

const cwd = process.cwd();

run(parsed._, parsed, cwd).catch((err) => {
  if (err instanceof InternalError) {
    error(
      "The following error is an internal unexpected error, these should never happen."
    );
    error("Please open an issue with the following link");
    error(
      `https://github.com/changesets/changesets/issues/new?title=${encodeURIComponent(
        `Unexpected error during ${parsed._[0] || "add"} command`
      )}&body=${encodeURIComponent(`## Error

\`\`\`
${format("", err).replace(process.cwd(), "<cwd>")}
\`\`\`

## Versions

- @changesets/cli@${
        // eslint-disable-next-line import/no-extraneous-dependencies
        require("@changesets/cli/package.json").version
      }
- node@${process.version}

## Extra details

<!-- Add any extra details of what you were doing, ideas you have about what might have caused the error and reproduction steps if possible. If you have a repository we can look at that would be great. 😁 -->
`)}`
    );
  }
  if (err instanceof ExitError) {
    return process.exit(err.code);
  }
  error(err);
  process.exit(1);
});
