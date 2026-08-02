# Releasing

How versions move through this repo and how a `flow-youtube-chat` release
reaches users on Greasyfork. Versioning is managed by
[changesets](https://github.com/changesets/changesets) in changelog-only mode:
nothing is published to any registry and no git tags are created — version
bumps exist to drive changelogs and `workspace:` ranges.

## Versioning model

Three separate steps; don't conflate them:

1. **The commit** carries the code change.
2. **A changeset** (`.changeset/*.md`) rides in that same commit — but only
   when the change alters what a consumer gets: flow-youtube-chat behavior a
   user would notice, or a lib package's public API / types / `lib/` output
   that siblings consume. Skip it for build/dev-tooling, CI, docs, tests, or
   behavior-neutral internal churn — including a dependency bump whose shipped
   behavior is identical (e.g. a typings-only patch); such changes ride along
   in the next release that ships for another reason.
3. **`changeset version`** runs later as its own `build: versioning` commit,
   consuming pending changesets to bump package versions and `workspace:`
   ranges and write each package's developer-facing `CHANGELOG.md`.

## Shipping flow-youtube-chat

Do this whenever `changeset version` bumps `flow-youtube-chat`. All commands
run from `packages/flow-youtube-chat`.

1. **Update the user-facing changelogs.** Add matching dated entries for the
   new version to `CHANGELOG_EN.md` and `CHANGELOG_JP.md` (Keep a Changelog
   format, both languages). These are written for Greasyfork users — describe
   visible behavior, not internals; the generated `CHANGELOG.md` is the
   developer-facing one.
2. **Rebuild:** `pnpm build`, so `dist/main/index.user.js` carries the new
   `@version`. Nothing auto-rebuilds and `dist/` is gitignored, so a change —
   even a plain dependency bump — reaches users only through this step.
3. **Print the release notes:** `pnpm release-note` prints the JP/EN changelog
   links to paste into the Greasyfork upload, and fails when either changelog
   lacks a dated entry for the version in `package.json` — a guard on step 1.
4. **Upload to Greasyfork** manually: the rebuilt `dist/main/index.user.js`,
   with the changelog links as the release notes.
