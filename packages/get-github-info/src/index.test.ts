import { getInfo, getInfoFromPullRequest } from ".";
import nock from "nock";
import prettier from "prettier";

process.env.GITHUB_TOKEN = "token";

let apiPath = `/graphql`;

test("associated with multiple PRs with only one merged", async () => {
  nock("https://api.github.com", {
    reqheaders: {
      Authorization: `Token ${process.env.GITHUB_TOKEN}`,
    },
  })
    .post(apiPath, ({ query }) => {
      expect(prettier.format(query, { parser: "graphql" }))
        .toMatchInlineSnapshot(`
        "query {
          a0: repository(owner: "emotion-js", name: "emotion") {
            aa085003: object(expression: "a085003") {
              ... on Commit {
                commitUrl
                associatedPullRequests(first: 50) {
                  nodes {
                    number
                    url
                    mergedAt
                    author {
                      login
                      url
                    }
                  }
                }
                author {
                  user {
                    login
                    url
                  }
                }
              }
            }
          }
        }
        "
      `);
      return true;
    })
    .reply(
      200,
      JSON.stringify({
        data: {
          a0: {
            aa085003: {
              commitUrl:
                "https://github.com/emotion-js/emotion/commit/a085003d4c8ca284c116668d7217fb747802ed85",
              associatedPullRequests: {
                nodes: [
                  {
                    number: 973,
                    url: "https://github.com/emotion-js/emotion/pull/973",
                    mergedAt: null,
                    author: {
                      login: "mitchellhamilton",
                      url: "https://github.com/mitchellhamilton",
                    },
                  },
                  {
                    number: 1600,
                    url: "https://github.com/emotion-js/emotion/pull/1600",
                    mergedAt: null,
                    author: {
                      login: "mitchellhamilton",
                      url: "https://github.com/mitchellhamilton",
                    },
                  },
                  {
                    number: 1613,
                    url: "https://github.com/emotion-js/emotion/pull/1613",
                    mergedAt: "2019-11-07T06:43:58Z",
                    author: {
                      login: "Andarist",
                      url: "https://github.com/Andarist",
                    },
                  },
                  {
                    number: 1628,
                    url: "https://github.com/emotion-js/emotion/pull/1628",
                    mergedAt: null,
                    author: {
                      login: "Andarist",
                      url: "https://github.com/Andarist",
                    },
                  },
                  {
                    number: 1630,
                    url: "https://github.com/emotion-js/emotion/pull/1630",
                    mergedAt: null,
                    author: {
                      login: "Andarist",
                      url: "https://github.com/Andarist",
                    },
                  },
                ],
              },
              author: {
                user: {
                  login: "Andarist",
                  url: "https://github.com/Andarist",
                },
              },
            },
          },
        },
      })
    );
  let result = await getInfo({ commit: "a085003", repo: "emotion-js/emotion" });
  expect(result).toMatchObject({ pull: 1613, user: "Andarist" });
});

test("associated with multiple PRs with multiple merged gets the one that was merged first", async () => {
  nock("https://api.github.com", {
    reqheaders: {
      Authorization: `Token ${process.env.GITHUB_TOKEN}`,
    },
  })
    .post(apiPath, ({ query }) => {
      expect(prettier.format(query, { parser: "graphql" }))
        .toMatchInlineSnapshot(`
        "query {
          a0: repository(owner: "emotion-js", name: "emotion") {
            aa085003: object(expression: "a085003") {
              ... on Commit {
                commitUrl
                associatedPullRequests(first: 50) {
                  nodes {
                    number
                    url
                    mergedAt
                    author {
                      login
                      url
                    }
                  }
                }
                author {
                  user {
                    login
                    url
                  }
                }
              }
            }
          }
        }
        "
      `);
      return true;
    })
    .reply(
      200,
      JSON.stringify({
        data: {
          a0: {
            aa085003: {
              commitUrl:
                "https://github.com/emotion-js/emotion/commit/a085003d4c8ca284c116668d7217fb747802ed85",
              associatedPullRequests: {
                nodes: [
                  {
                    number: 973,
                    url: "https://github.com/emotion-js/emotion/pull/973",
                    mergedAt: null,
                    author: {
                      login: "mitchellhamilton",
                      url: "https://github.com/mitchellhamilton",
                    },
                  },
                  {
                    number: 1600,
                    url: "https://github.com/emotion-js/emotion/pull/1600",
                    mergedAt: "2019-11-20T06:43:58Z",
                    author: {
                      login: "mitchellhamilton",
                      url: "https://github.com/mitchellhamilton",
                    },
                  },
                  {
                    number: 1613,
                    url: "https://github.com/emotion-js/emotion/pull/1613",
                    mergedAt: "2019-11-07T06:43:58Z",
                    author: {
                      login: "Andarist",
                      url: "https://github.com/Andarist",
                    },
                  },
                  {
                    number: 1628,
                    url: "https://github.com/emotion-js/emotion/pull/1628",
                    mergedAt: null,
                    author: {
                      login: "Andarist",
                      url: "https://github.com/Andarist",
                    },
                  },
                  {
                    number: 1630,
                    url: "https://github.com/emotion-js/emotion/pull/1630",
                    mergedAt: null,
                    author: {
                      login: "Andarist",
                      url: "https://github.com/Andarist",
                    },
                  },
                ],
              },
              author: {
                user: {
                  login: "Andarist",
                  url: "https://github.com/Andarist",
                },
              },
            },
          },
        },
      })
    );
  let result = await getInfo({ commit: "a085003", repo: "emotion-js/emotion" });
  expect(result).toMatchObject({ pull: 1613, user: "Andarist" });
});

test("gets the author of the associated pull request if it exists rather than the author of the changeset", async () => {
  nock("https://api.github.com", {
    reqheaders: {
      Authorization: `Token ${process.env.GITHUB_TOKEN}`,
    },
  })
    .post(apiPath, ({ query }) => {
      expect(prettier.format(query, { parser: "graphql" }))
        .toMatchInlineSnapshot(`
        "query {
          a0: repository(owner: "JedWatson", name: "react-select") {
            ac7e9c69: object(expression: "c7e9c69") {
              ... on Commit {
                commitUrl
                associatedPullRequests(first: 50) {
                  nodes {
                    number
                    url
                    mergedAt
                    author {
                      login
                      url
                    }
                  }
                }
                author {
                  user {
                    login
                    url
                  }
                }
              }
            }
          }
        }
        "
      `);
      return true;
    })
    .reply(
      200,
      JSON.stringify({
        data: {
          a0: {
            ac7e9c69: {
              commitUrl:
                "https://github.com/JedWatson/react-select/commit/c7e9c697dada15ce3ff9a767bf914ad890080433",
              associatedPullRequests: {
                nodes: [
                  {
                    number: 3682,
                    url: "https://github.com/JedWatson/react-select/pull/3682",
                    mergedAt: "2019-10-02T07:37:15Z",
                    author: {
                      login: "lmvco",
                      url: "https://github.com/lmvco",
                    },
                  },
                ],
              },
              author: {
                user: {
                  login: "JedWatson",
                  url: "https://github.com/JedWatson",
                },
              },
            },
          },
        },
      })
    );
  let result = await getInfo({
    commit: "c7e9c69",
    repo: "JedWatson/react-select",
  });
  expect(result).toMatchObject({ pull: 3682, user: "lmvco" });
});

test("throws error on missing repo name", async () => {
  const request = {
    commit: "c7e9c69",
  };

  await expect(async () =>
    // @ts-expect-error
    getInfo(request)
  ).rejects.toThrowErrorMatchingInlineSnapshot(
    `"Please pass a GitHub repository in the form of userOrOrg/repoName to getInfo"`
  );
});

test("throws error on invalid repo name", async () => {
  const request = {
    commit: "c7e9c69",
    repo: "https://github.com/JedWatson/react-select",
  };

  await expect(() =>
    getInfo(request)
  ).rejects.toThrowErrorMatchingInlineSnapshot(
    `"Please pass a valid GitHub repository in the form of userOrOrg/repoName to getInfo (it has to match the "^[\\w.-]+\\/[\\w.-]+$" pattern)"`
  );
});

test("retrieve information from a given PR", async () => {
  nock("https://api.github.com", {
    reqheaders: {
      Authorization: `Token ${process.env.GITHUB_TOKEN}`,
    },
  })
    .post(apiPath, ({ query }) => {
      expect(prettier.format(query, { parser: "graphql" }))
        .toMatchInlineSnapshot(`
        "query {
          a0: repository(owner: "emotion-js", name: "emotion") {
            pr__1613: pullRequest(number: 1613) {
              url
              author {
                login
                url
              }
              mergeCommit {
                commitUrl
                abbreviatedOid
              }
            }
          }
        }
        "
      `);
      return true;
    })
    .reply(
      200,
      JSON.stringify({
        data: {
          a0: {
            pr__1613: {
              url: "https://github.com/emotion-js/emotion/pull/1613",
              author: {
                login: "Andarist",
                url: "https://github.com/Andarist",
              },
              mergeCommit: {
                commitUrl:
                  "https://github.com/emotion-js/emotion/commit/a085003d4c8ca284c116668d7217fb747802ed85",
                abbreviatedOid: "a085003",
              },
            },
          },
        },
      })
    );
  let result = await getInfoFromPullRequest({
    pull: 1613,
    repo: "emotion-js/emotion",
  });
  expect(result).toMatchInlineSnapshot(`
    {
      "commit": "a085003",
      "links": {
        "commit": "[\`a085003\`](https://github.com/emotion-js/emotion/commit/a085003d4c8ca284c116668d7217fb747802ed85)",
        "pull": "[#1613](https://github.com/emotion-js/emotion/pull/1613)",
        "user": "[@Andarist](https://github.com/Andarist)",
      },
      "user": "Andarist",
    }
  `);
});
