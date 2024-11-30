---
"@changesets/changelog-github": minor
---

You can now remove links from GitHub usernames, allowing your contributors to appear prominently in releases in the "Contributors" section.

To make use of this feature, set `linkUsernames` to `false` in your .changeset/config.json file:

```diff
{
    "$schema": "https://unpkg.com/@changesets/config@1.7.0/schema.json",
    "changelog": [
        "@changesets/changelog-github",
        {
            "repo": "your-org/your-repo",
+           "linkUsernames": false
        }
    ]
}
```

See [GitHub documentation](https://docs.github.com/en/repositories/releasing-projects-on-github/managing-releases-in-a-repository) for more details.