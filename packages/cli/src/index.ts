import meow from "meow";
import { ExitError, InternalError } from "@changesets/errors";
import { error } from "@changesets/logger";
import { format } from "util";
import { run } from "./run";

const { input, flags } = meow(
  `
  Usage
    $ changesets [command]
  Commands
    init
    add [--empty]
    version [--ignore]
    publish [--otp=code]
    status [--since-master --verbose --output=JSON_FILE.json]
    pre <enter|exit> <tag>
    `,
  {
    flags: {
      sinceMaster: {
        type: "boolean"
      },
      verbose: {
        type: "boolean",
        alias: "v"
      },
      output: {
        type: "string",
        alias: "o"
      },
      otp: {
        type: "string"
      },
      empty: {
        type: "boolean"
      },
      since: {
        type: "string"
      },
      ignore: {
        type: "string",
        isMultiple: true
      },
      releasePlan: {
        type: "boolean"
      },
      tag: {
        type: "string"
      }
    }
  }
);

const cwd = process.cwd();

run(input, flags, cwd).catch(err => {
  if (err instanceof InternalError) {
    error(
      "The following error is an internal unexpected error, these should never happen."
    );
    error("Please open an issue with the following link");
    error(
      `https://github.com/atlassian/changesets/issues/new?title=${encodeURIComponent(
        `Unexpected error during ${input[0] || "add"} command`
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
