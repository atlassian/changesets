import pc from "picocolors";
import { spawn } from "child_process";
import path from "path";

import * as git from "@changesets/git";
import { info, log, warn } from "@changesets/logger";
import { shouldSkipPackage } from "@changesets/should-skip-package";
import { Config } from "@changesets/types";
import writeChangeset from "@changesets/write";
import { getPackages } from "@manypkg/get-packages";
import { ExternalEditor } from "external-editor";
import { getCommitFunctions } from "../../commit/getCommitFunctions.ts";
import * as cli from "../../utils/cli-utilities.ts";
import { getVersionableChangedPackages } from "../../utils/versionablePackages.ts";
import createChangeset from "./createChangeset.ts";
import printConfirmationMessage from "./messages.ts";

export default async function add(
  cwd: string,
  { empty, open }: { empty?: boolean; open?: boolean },
  config: Config
) {
  const packages = await getPackages(cwd);
  if (packages.packages.length === 0) {
    throw new Error(
      `No packages found. You might have ${packages.tool} workspaces configured but no packages yet?`
    );
  }
  const versionablePackages = packages.packages.filter(
    (pkg) =>
      !shouldSkipPackage(pkg, {
        ignore: config.ignore,
        allowPrivatePackages: config.privatePackages.version,
      })
  );
  const changesetBase = path.resolve(cwd, ".changeset");

  let newChangeset: Awaited<ReturnType<typeof createChangeset>>;
  if (empty) {
    newChangeset = {
      confirmed: true,
      releases: [],
      summary: ``,
    };
  } else {
    const changedPackagesNames = (
      await getVersionableChangedPackages(config, {
        cwd,
      })
    ).map((pkg) => pkg.packageJson.name);

    newChangeset = await createChangeset(
      changedPackagesNames,
      versionablePackages
    );
    printConfirmationMessage(newChangeset, versionablePackages.length > 1);

    if (!newChangeset.confirmed) {
      newChangeset = {
        ...newChangeset,
        confirmed: await cli.askConfirm("Is this your desired changeset?"),
      };
    }
  }

  if (newChangeset.confirmed) {
    const changesetID = await writeChangeset(newChangeset, cwd);
    const [{ getAddMessage }, commitOpts] = getCommitFunctions(
      config.commit,
      cwd
    );
    if (getAddMessage) {
      await git.add(path.resolve(changesetBase, `${changesetID}.md`), cwd);
      await git.commit(await getAddMessage(newChangeset, commitOpts), cwd);
      log(pc.green(`${empty ? "Empty " : ""}Changeset added and committed`));
    } else {
      log(
        pc.green(
          `${empty ? "Empty " : ""}Changeset added! - you can now commit it\n`
        )
      );
    }

    let hasMajorChange = [...newChangeset.releases].find(
      (c) => c.type === "major"
    );

    if (hasMajorChange) {
      warn(
        "This Changeset includes a major change and we STRONGLY recommend adding more information to the changeset:"
      );
      warn("WHAT the breaking change is");
      warn("WHY the change was made");
      warn("HOW a consumer should update their code");
    } else {
      log(
        pc.green(
          "If you want to modify or expand on the changeset summary, you can find it here"
        )
      );
    }
    const changesetPath = path.resolve(changesetBase, `${changesetID}.md`);
    info(pc.blue(changesetPath));

    if (open) {
      // this is really a hack to reuse the logic embedded in `external-editor` related to determining the editor
      const externalEditor = new ExternalEditor();
      externalEditor.cleanup();
      spawn(
        externalEditor.editor.bin,
        externalEditor.editor.args.concat([changesetPath]),
        {
          detached: true,
          stdio: "inherit",
        }
      );
    }
  }
}
