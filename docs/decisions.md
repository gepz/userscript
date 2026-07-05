# Decisions and non-obvious history

Why things that look odd are the way they are. Add an entry whenever a change
encodes reasoning that the code alone can't show; delete entries when they
stop being true.

## hyperapp needs a DOM-interface stub (2026-07)

hyperapp 2.0.22 (the final release of a dormant project) ships typings that
subtract `DocumentAndElementEventHandlers` from `HTMLElement`. TypeScript 5.0
removed that interface from `lib.dom` (its members moved onto
`HTMLElement`/`GlobalEventHandlers`), so any whole-program check fails inside
hyperapp's `index.d.ts`. Each hyperapp-consuming package carries
`src/hyperappDomCompat.d.ts`, an empty ambient stand-in.

Earlier workaround, now removed: `ui` replaced the compiler's entire DOM lib
via `"@typescript/lib-dom": "npm:@types/web@^0.0.86"`, which froze its DOM
types at early 2023. Don't reintroduce it; the stub is strictly narrower. The
error stayed invisible in other packages for two years because nothing ran a
whole-program check (see the fork-ts-checker entry).

## fork-ts-checker: checker yes, emitter no (2026-07; first tried 2023-08)

`ForkTsCheckerWebpackPlugin` ran redundantly beside a fully-checking
ts-loader until 2023-08, was then commented out during an experiment with
`typescript: { build: true, mode: 'write-dts' }` (emitting lib declarations
from the webpack build), and the experiment was abandoned: the emitted
declarations need `tsc-alias` to rewrite `@/` aliases, and fork-ts-checker
has no post-emit hook. From then until 2026-07 nothing whole-program-checked
the tree, which let the hyperapp typing break hide.

Current design: ts-loader is `transpileOnly`; fork-ts-checker runs as a pure
checker (no emit) against `tsconfig.build.json`; lib output stays with
`tsc && tsc-alias`. Bundles were verified byte-identical before/after the
`transpileOnly` switch.

## Registry history: Verdaccio era is over (2022-08)

The repo began on npm workspaces with plain semver ranges for sibling deps,
which sometimes resolved to a registry — hence a local Verdaccio and a
publish-before-consume workflow. The 2022-08 switch to pnpm plus the
`workspace:` protocol made intra-repo resolution purely symlink-based; pnpm
errors rather than falling back to a registry. No Verdaccio configuration
remains, and none is needed unless a *different* repo must consume these
packages.

## eslint 9 migration choices (2026-07)

- `eslint-config-airbnb` and `eslint-config-airbnb-typescript` are
  unmaintained dead ends; `eslint-config-airbnb-extended` replaces both and
  moves import rules to the maintained `eslint-plugin-import-x`.
- `eslint-plugin-consistent-default-export-name` is unmaintained. Its
  export-side rule is replaced by the maintained
  `canonical/filename-match-exported`; no maintained equivalent exists for
  `default-import-match-filename`, so the old plugin survives for that one
  rule behind `@eslint/compat`'s `fixupPluginRules`.
- Many `sharedRules` values pin the pre-migration effective config (extracted
  from `--print-config` snapshots) because airbnb-extended's
  @stylistic-ported defaults would otherwise reformat the committed style.

## Version pins that are deliberate

- `@fp-ts/optic` emits an unmet-peer warning for `@effect/typeclass`: 0.25.0
  is optic's latest release and its peer floor is simply stale. Harmless.
- `webpack-bundle-analyzer` stays on v4 + `@types/webpack-bundle-analyzer`:
  v5 ships no typings at all and DefinitelyTyped has none for it. If its
  types ever mismatch webpack's, check for duplicate webpack instances in the
  lockfile first (`pnpm dedupe` fixed exactly that once).

## micro-memoize is bundled, not CDN-required (2026-07)

flow-youtube-chat loads most runtime deps as userscript `@require`s (UMD
globals + webpack externals). micro-memoize left that pattern at v5: its UMD
build reads `global.fastEquals` and `global.fastStringify`, but fast-equals'
own UMD registers `global["fast-equals"]` (and fast-stringify's global
doesn't match either), so the three CDN files cannot see each other without
a shim script. Bundling it (plus those two small deps) costs ~18 KiB and
removes the coordination problem. hash-it stayed a `@require`; its v7 moved
the browser file to `dist/umd/index.js` and dropped the default export
(`import { hash }`).
