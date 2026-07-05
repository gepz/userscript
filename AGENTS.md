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
- **Type checking rides the webpack build.** There are no typecheck scripts;
  `fork-ts-checker-webpack-plugin` (wired in `@userscript/webpack-config`)
  checks the whole `tsconfig.build.json` program on every `dev`/`build`. For a
  check without building, run
  `npx tsc -p tsconfig.build.json --noEmit` in the package. Bare tsc is
  stricter: fork-ts-checker does not report errors located inside dependency
  declaration files, so after dependency bumps run bare tsc too (CI does). Don't gate on the
  package-root `tsconfig.json` — it also pulls in config files and
  work-in-progress sources that are excluded from real builds.
- **Lint.** eslint 9 flat config; the shared config is the
  `@userscript/eslint-config` package (see its `packageConfig` factory). Run
  `npx eslint .` inside a package. Generated output (`lib/`, `dist/`) is
  ignored by config, not by being clean.
- **Versioning.** changesets, changelog-only (no publish, no tags). Include
  the `.changeset/*.md` file in the same commit as the change it describes;
  run `changeset version` later as its own `build: versioning` commit.

## Coding conventions

- **Don't name a class `XxxService`** unless explicitly instructed to. Reach for a name
  that says what the type *is* or *does*.
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
