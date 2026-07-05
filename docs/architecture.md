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

## Build pipeline

Userscript packages bundle with webpack driven by TypeScript config files
(`config/webpack.config.*.ts`, loaded through ts-node). Those configs merge
fragments from `@userscript/webpack-config`:

- `tsLoaderConfig` — ts-loader with `transpileOnly: true`; the loader only
  transpiles.
- `tsbaseConfig` — adds `ForkTsCheckerWebpackPlugin`, which type-checks the
  whole `tsconfig.build.json` program in a parallel process on every dev and
  prod build. This is the repo's only routine whole-program type gate; it
  covers files webpack never loads and dependency `.d.ts` files.

Lib packages build with plain `tsc --project tsconfig.lib.json` followed by
`tsc-alias` (which rewrites `@/` path aliases inside the emitted files). The
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
- `tsconfig.json` — the everything view for editors and ts-node: also
  includes `config/` and any work-in-progress sources excluded from builds
  (e.g. via `tsconfig.exclude.json` in flow-youtube-chat). It is not expected
  to pass a full `tsc` run; don't use it as a gate.

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
the workspace (pnpm symlinks regardless); they exist for the changelogs.
