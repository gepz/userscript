# Agent Conventions

Defaults for coding agents working in this repo. Project-specific rules elsewhere in
this file (or in nested `AGENTS.md` files) win on any conflict.

## Working in this repo

Deeper background lives in `docs/architecture.md` (how the pieces fit),
`docs/decisions.md` (why non-obvious things are the way they are), and
`docs/backlog.md` (known work not yet done). Read the first two before
restructuring builds, configs, or dependencies.

- **Toolchain.** Node >= 24 via nvm and pnpm >= 11 via corepack. Fresh shells may
  resolve an old Node first; run `nvm use default` if node or pnpm misbehaves.
  npm and yarn are blocked by `only-allow pnpm`.
- **Commits.** Conventional commits enforced by commitlint (husky `commit-msg`
  hook). Allowed types: `build`, `ci`, `docs`, `feat`, `fix`, `perf`,
  `refactor`, `revert`, `test` — there is no `style` or `chore`; use
  `refactor` or `build` instead.
- **Sibling packages link, never publish.** Cross-package deps use the
  `workspace:` protocol; pnpm symlinks the package directory. Nothing is
  published to any registry. The symlink serves each package's committed build
  output, so after changing a lib package (`ui`, `webpack-config`,
  `forward-to`, `cdn-from-dependency`, `tap-non-null`), run its `build-lib`
  and commit the regenerated `lib/` — otherwise siblings silently consume
  stale code.
- **Verification.** The mechanism's home is `docs/architecture.md`,
  "Verification". The working rules: `dev`/`build` type-check continuously
  (fork-ts-checker); `pnpm typecheck` in a package is the same program
  under bare tsc, which also reports errors inside dependency declaration
  files — so run it after dependency bumps. Commit hooks are cheap
  (secretlint + commitlint); push verifies only what changed; CI is the
  authoritative full run, and `pnpm verify` at the root is its cheap-gate
  equivalent on demand. Don't gate on the package-root `tsconfig.json` —
  it also pulls in config files and work-in-progress sources that are
  excluded from real builds.
- **Lint.** eslint 9 flat config; the shared config is the
  `@userscript/eslint-config` package (see its `packageConfig` factory). Run
  `pnpm lint` inside a package (`eslint . --fix`), or `npx eslint .` for a
  check that won't rewrite files. Generated output (`lib/`, `dist/`) is
  ignored by config, not by being clean.
- **Versioning.** changesets, changelog-only (no publish, no tags); the full
  model and release process live in `docs/releasing.md`. The per-commit rule:
  a changeset (`.changeset/*.md`) rides in the same commit as the change, but
  *only when the change alters what a consumer gets* — flow-youtube-chat
  behavior a user would notice, or a lib package's public API / types / `lib`
  output that siblings consume. Skip it for build/dev-tooling, CI, docs,
  tests, or behavior-neutral internal churn (e.g. a typings-only dependency
  patch); it rides along in the next release that ships for another reason.
- **Releasing flow-youtube-chat.** Follow `docs/releasing.md`. In particular:
  whenever `changeset version` bumps `flow-youtube-chat`, the user-facing
  `CHANGELOG_EN.md`/`CHANGELOG_JP.md` need matching dated entries and the
  userscript needs a rebuild — `dist/` is gitignored and nothing auto-rebuilds,
  so no change reaches users otherwise.

## Coding conventions

- **Name a type for what it *is* or *does*.** In particular, don't name a class
  `XxxService` unless explicitly instructed to.
- **No emojis in comments.**
- **Comment the non-obvious.** Spend comments on unexpected usage constraints, side
  effects, and the *why* behind a decision — not on restating what the code already says.
- **Comments describe the present, not the past.** Don't leave historical notes
  (`Modified X`, `Fixed Y`, `was previously …`) in existing comments — either delete them
  or rewrite them to describe the code's current intent, behavior, or constraints.
  Revision history belongs to version control.
- **Comments are testimony, not ground truth.** Before repeating or building on a
  comment's claim about how something works — especially one describing a mechanism
  defined far from where the comment sits — verify it against the code (and any
  authoritative docs). If they disagree, the code is the description of current
  behavior: fix the comment in the same change — unless the comment reads like lost
  intent rather than a stale description, in which case surface the discrepancy
  instead of silently rewriting it.
- **Explain a cross-cutting mechanism once — when it's non-trivial and liable to change.**
  Give it a single home — a `docs/` file if one exists, otherwise the type that implements
  or enforces it — and have other sites carry only the *local constraint* plus a pointer,
  never a re-derivation. The tell: behavior no edit at those lines could change is a
  mechanism — point at the home; something a future editor *of this code* must respect is
  local — inline it. Prefer pointing at a stable symbol (greppable, survives renames) over
  a bare path. Keep version gates and "remove once X" notes in `docs/backlog.md` or memory,
  not restated across comments.
- **Fix bugs at the root, not around them.** Avoid speculative workarounds or defensive
  coding that adds technical debt. Add logs, prints, or tests to probe the environment
  and confirm the exact cause and conditions first, then make a precise fix. Remove any
  temporary logs or debug prints once the issue is resolved.
- **Prefer modern, modular patterns** over legacy or monolithic ones.

## Agent-doc filename convention

`AGENTS.md` is the canonical file; `CLAUDE.md` is a symlink to it, so either filename a
tool loads resolves to the same text with nothing to keep in sync.

```sh
ln -s AGENTS.md CLAUDE.md
```
