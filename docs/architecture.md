# Architecture

A pnpm workspace (`packages/**`) of TypeScript userscripts plus the shared
infrastructure they build on. Everything is consumed in-repo through
`workspace:` symlinks; nothing is published to a registry.

## Package roles

| Package | Role |
| --- | --- |
| `flow-youtube-chat` | Userscript: YouTube live-chat overlay (webpack bundle in `dist/`) |
| `custom-sort` | Userscript: page sorting (webpack bundle in `dist/`) |
| `ui` | Shared hyperapp UI components; ships compiled `lib/` + umd `dist/` |
| `webpack-config` | Shared webpack config fragments; ships compiled `lib/` |
| `eslint-config` | Shared eslint 9 flat-config hub (plain `.mjs`, no build) |
| `forward-to`, `tap-non-null`, `cdn-from-dependency` | Small utility libs; ship compiled `lib/` |

## flow-youtube-chat runtime lifecycle

The userscript runs inside YouTube's SPA, which offers no lifecycle hooks
and replaces its custom-element DOM at arbitrary times (navigation, chat
re-renders, player swaps). The overlay therefore treats "where are my
anchor elements" as state to re-derive continuously, and `allStream` is
the single composition root where that lifecycle is wired: `initialize`
builds the config machinery and the hyperapp UIs, then just
`Stream.runDrain`s what `allStream` returns. Domain behavior lives in
small per-concern modules (`onChatFieldMutate`, `videoToggleStream`,
`configStream`, ...); `allStream` only wires them, so subscription
scoping and teardown stay visible in one file instead of being scattered.

The stream nests three layers, each replacing everything below it when
it fires (`switch: true`):

- **Reinitialize** — a `reinitQueue` signal (URL change, error recovery)
  cancels and rebuilds the whole graph.
- **Poll** — a 700 ms schedule re-reads every `LivePageState` anchor;
  a tick where any element appeared or disappeared re-runs `setup`
  (observer attach, UI mounts) and swaps in fresh branch streams.
  Polling rather than events, because YouTube exposes no reliable
  signal for its re-renders. Consequence: `setup` and the branches are
  re-executed per tick and must read the element caches at run time —
  `setup` is `Z.suspend`ed and `branches` is a function for exactly
  that reason (see the comments at those sites).
- **Branches** — the merged per-concern streams (broadcast config
  entries, config-ref changes, DOM/resize observers, video play state,
  URL changes, settings rect), merged unbounded.

The whole pipeline is wrapped in `resilient`, a recursive
`catchAllCause` (log, sleep 5 s, reinitialize) — the counterpart of
rxjs `retry({delay})` — because a defect in any one branch must not
kill the overlay for the rest of the page's lifetime.

## Build pipeline

Userscript packages bundle with webpack driven by TypeScript config files
(`config/webpack.config.*.mts`, run straight from source by Node's type
stripping — see `docs/decisions.md` for why they are `.mts` and not `.ts`).
Those configs merge fragments from
`@userscript/webpack-config`:

- `tsLoaderConfig` — ts-loader with `transpileOnly: true`; the loader only
  transpiles.
- `tsbaseConfig` — adds `ForkTsCheckerWebpackPlugin`, which type-checks the
  whole `tsconfig.build.json` program in a parallel process on every dev and
  prod build. This is the repo's only routine whole-program type gate; it
  covers files webpack never loads and dependency `.d.ts` files.

Lib packages build with plain `tsc --project tsconfig.lib.json` followed by
`tsc-alias` (which rewrites `@/` path aliases inside the emitted files);
`webpack-config` also passes `--resolve-full-paths`, because Node loads its
`lib/` directly and its ESM resolver rejects the extensionless specifiers
tsc copies through — see `docs/decisions.md`. The
resulting `lib/` is committed, because sibling packages resolve the
`workspace:` symlink straight into it. Do not try to move declaration emit
into fork-ts-checker's `write-dts` mode: it has no post-emit hook, so
`tsc-alias` can never run over its output (this was tried and abandoned; see
`docs/decisions.md`).

## tsconfig layering

Root `tsconfig.*.json` files are the shared bases (`base` → `src` →
`lib`/`bundle`); packages extend them.

- `tsconfig.build.json` — the real program: `src/` only, used by ts-loader,
  fork-ts-checker, and eslint's type-aware rules (`srcProject`).
- `tsconfig.json` — the everything view for editors: also
  includes `config/` and any work-in-progress sources excluded from builds
  (e.g. via `tsconfig.exclude.json` in flow-youtube-chat). It is not expected
  to pass a full `tsc` run; don't use it as a gate.
- `tsconfig.spec.json` (flow-youtube-chat) — src plus `*.spec.ts`, which the
  root base config excludes from every other project. Used by typed eslint on
  spec files and referenced from the package `tsconfig.json` so editors
  resolve `@/` inside specs; it must stay `composite` for that reference
  lookup to work. Unlike `tsconfig.json`, a full
  `tsc -p tsconfig.spec.json --noEmit` is expected to pass.

## Lint architecture

`@userscript/eslint-config` is a hub of flat-config fragments (`baseConfig`,
`tsConfig`, `tsWebpackConfig`, `sharedRules`) plus a `packageConfig` factory
that assembles them. Each package's `eslint.config.mjs` is a short call into
that factory. Generated output (`lib/`, `dist/`, `**/*.js|cjs|mjs`) is
ignored in the factory's global ignores. Rule values that look arbitrary are
often pinned to preserve the pre-eslint-9 formatting; check the comments in
`sharedRules` before "simplifying" them.

## Versioning

changesets, changelog-only: `.changeset/*.md` files travel with the commits
that earn them, and a later `changeset version` run (committed as
`build: versioning`) folds them into package `CHANGELOG.md`s and version
bumps. No publish, no tags. Version numbers have no resolution effect inside
the workspace (pnpm symlinks regardless); they exist for the changelogs and
for the userscript `@version` headers (Greasy Fork update detection).

## Verification

One vocabulary everywhere: per-package `lint`, `typecheck` (bare
`tsc --noEmit` over the build program), and `test` scripts, with root
scripts fanning each out workspace-wide (`pnpm verify` runs all three).
Three rungs run them, each scoped to what it can cheaply guarantee:

- **While developing** — `pnpm dev`/`build` type-check continuously via
  fork-ts-checker; this is the primary discovery loop, not the hooks.
- **Hooks** — commit is deliberately cheap: secretlint (lint-staged) and
  commitlint, nothing else. Push (`.husky/pre-push`) mirrors CI's cheap
  gates — lint, typecheck, test — but only for packages changed since the
  remote head plus their dependents (`pnpm --filter '...[<sha>]'`), so a
  docs-only push runs nothing and a lib change also checks its consumers.
  Root-level changes outside `packages/` (lockfile, shared tsconfigs,
  patches) drop the filter and run everything; docs, changesets, and
  `.github` are excluded from that trigger. A push can still skip the
  hook (`--no-verify`) or predate a dependency of a branch — CI assumes
  nothing ran locally.
- **CI** (`.github/workflows/ci.yml`, pushes to `main` and PRs) — the
  authoritative full run, and the only rung that builds:
  `pnpm install --frozen-lockfile`, workspace-wide lint, `pnpm -r run
  build`, the two userscripts' `typecheck`, and `pnpm -r run test`, with
  `git diff --exit-code` gates after lint and build. The diff gates are
  load-bearing: lint scripts run `eslint --fix`, so drift means an
  auto-fixable violation; and builds regenerate the committed `lib/`
  output, so drift means a sibling package was consuming stale code.
  Type checking mostly rides the builds (tsc for `build-lib`,
  fork-ts-checker for the webpack bundles); the bare `typecheck` step
  exists for the two userscripts only, because fork-ts-checker does not
  report errors located inside dependency declaration files and the
  userscripts have no other whole-program tsc pass — lib packages get
  theirs from `build-lib`.
