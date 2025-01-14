import { ChangelogFunctions } from "@changesets/types";
// @ts-ignore
import { config } from "dotenv";
import { getInfo, getInfoFromPullRequest } from "@changesets/get-github-info";
import { execSync } from "child_process";

config();

const changelogFunctions: ChangelogFunctions = {
  getDependencyReleaseLine: async (
    changesets,
    dependenciesUpdated,
    options
  ) => {
    if (!options.repo) {
      const { repoOwner, repoName } = getGithubRepoInfo();
      if (!repoOwner || !repoName) {
        throw new Error(
          'Please provide a repo to this changelog generator like this:\n"changelog": ["@changesets/changelog-github", { "repo": "org/repo" }]'
        );
      }
      options.repo = `${repoOwner}/${repoName}`;
    }
    if (dependenciesUpdated.length === 0) return "";

    const changesetLink = `- Updated dependencies [${(
      await Promise.all(
        changesets.map(async (cs) => {
          if (cs.commit) {
            let { links } = await getInfo({
              repo: options.repo,
              commit: cs.commit,
            });
            return links.commit;
          }
        })
      )
    )
      .filter((_) => _)
      .join(", ")}]:`;

    const updatedDepenenciesList = dependenciesUpdated.map(
      (dependency) => `  - ${dependency.name}@${dependency.newVersion}`
    );

    return [changesetLink, ...updatedDepenenciesList].join("\n");
  },
  getReleaseLine: async (changeset, type, options) => {
    if (!options || !options.repo) {
      throw new Error(
        'Please provide a repo to this changelog generator like this:\n"changelog": ["@changesets/changelog-github", { "repo": "org/repo" }]'
      );
    }

    let prFromSummary: number | undefined;
    let commitFromSummary: string | undefined;
    let usersFromSummary: string[] = [];

    const replacedChangelog = changeset.summary
      .replace(/^\s*(?:pr|pull|pull\s+request):\s*#?(\d+)/im, (_, pr) => {
        let num = Number(pr);
        if (!isNaN(num)) prFromSummary = num;
        return "";
      })
      .replace(/^\s*commit:\s*([^\s]+)/im, (_, commit) => {
        commitFromSummary = commit;
        return "";
      })
      .replace(/^\s*(?:author|user):\s*@?([^\s]+)/gim, (_, user) => {
        usersFromSummary.push(user);
        return "";
      })
      .trim();

    const [firstLine, ...futureLines] = replacedChangelog
      .split("\n")
      .map((l) => l.trimRight());

    const links = await (async () => {
      if (prFromSummary !== undefined) {
        let { links } = await getInfoFromPullRequest({
          repo: options.repo,
          pull: prFromSummary,
        });
        if (commitFromSummary) {
          const shortCommitId = commitFromSummary.slice(0, 7);
          links = {
            ...links,
            commit: `[\`${shortCommitId}\`](https://github.com/${options.repo}/commit/${commitFromSummary})`,
          };
        }
        return links;
      }
      const commitToFetchFrom = commitFromSummary || changeset.commit;
      if (commitToFetchFrom) {
        let { links } = await getInfo({
          repo: options.repo,
          commit: commitToFetchFrom,
        });
        return links;
      }
      return {
        commit: null,
        pull: null,
        user: null,
      };
    })();

    const users = usersFromSummary.length
      ? usersFromSummary
          .map(
            (userFromSummary) =>
              `[@${userFromSummary}](https://github.com/${userFromSummary})`
          )
          .join(", ")
      : links.user;

    const prefix = [
      links.pull === null ? "" : ` ${links.pull}`,
      links.commit === null ? "" : ` ${links.commit}`,
      users === null ? "" : ` Thanks ${users}!`,
    ].join("");

    return `\n\n-${prefix ? `${prefix} -` : ""} ${firstLine}\n${futureLines
      .map((l) => `  ${l}`)
      .join("\n")}`;
  },
};

function getGithubRepoInfo() {
  try {
    const remoteUrl = execSync("git remote get-url origin").toString();

    // Handle SSH format: git@github.com:owner/repo.git
    // Handle HTTPS format: https://github.com/owner/repo.git
    const match = remoteUrl.match(/(?:github\.com[:/])([^/]+)\/([^/]+)/);

    if (!match) {
      return { repoOwner: "", repoName: "" };
    }

    const [, repoOwner, repoName] = match;
    return { repoOwner, repoName: repoName.replace(/\.git$/, "") };
  } catch (err) {
    return { repoOwner: "", repoName: "" };
  }
}

export default changelogFunctions;
