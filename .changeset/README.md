# Changesets

This folder holds [Changesets](https://github.com/changesets/changesets) data.

Add a changeset when your change should be released:

```bash
pnpm changeset
```

The release workflow (`.github/workflows/release.yml`) opens a "Version Packages"
pull request that consumes the pending changesets and updates the changelogs.
Merge it to publish.
