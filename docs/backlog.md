# Backlog

Work worth doing, roughly ordered — repo-level items first, then the
flow-youtube-chat bugs and wishlist. Remove items when done; re-verify
versions before starting, this list ages.

## Security / correctness

- **hyperapp is dormant upstream** (2.0.22 final, typings papered over by
  `hyperappDomCompat.d.ts`). Long-term: migrate off or vendor.

## flow-youtube-chat bugs

- Max chat amount sometimes misbehaves, removing chats prematurely
  before they should go.

## Design decisions pending

- **Decide the fate of the typed filter-expression editor WIP** in
  flow-youtube-chat: a typed, restricted expression system meant to power a
  type-checked editing UI for user-defined chat filters (~3.2k lines across
  `src/type`, `src/typedExpression`, `src/restrictedExpression`,
  `src/settingUI/{filter,filterPanel,EditableExpression}`,
  `src/filter/filterContextType`; all excluded via `tsconfig.exclude.json`,
  while the old panel `filterPanelOld` still ships).
  With `expression-eval` replaced by `jsep` + `src/filter/evaluateExpression`,
  this is editor UX work, not security work. Options: finish as designed
  (generic type inference; two files still have mid-edit syntax errors),
  rescope to first-order type checking in direct-style TypeScript, or delete
  the WIP. Design scratch notes live in
  `packages/flow-youtube-chat/filter_logic.md`.

## Dependency majors (deferred deliberately)

- `webpack-bundle-analyzer` 5: ships no typings — see `docs/decisions.md`.
- Effect v4 (beta since early 2026, will be LTS): single-version ecosystem,
  much smaller core, and a built-in `Optic` module that replaces the frozen
  `@fp-ts/optic` (v0.25.0, stale peer floor). Migrate when v4 is stable,
  not during beta. Pain points pre-scanned in `docs/effect-v4-scan.md`
  (2026-07): the big items are Option-as-Effect subtyping removal,
  `Either`→`Result`, and `@effect/typeclass` having no v4 counterpart —
  which makes deciding the filter-editor WIP's fate (above) a prerequisite.
  The `FiberRef`→`Context.Reference` logger rewrite was pulled forward into
  v3 (2026-07, `docs/effect-v3-adoption.md`); only the logger-callback
  shape change and `References.MinimumLogLevel` remain there.
- TypeScript 6.x once typescript-eslint supports it.
- eslint 10: blocked on plugin ecosystem (`eslint-config-airbnb-extended`,
  `eslint-plugin-canonical`, the compat-shimmed
  `eslint-plugin-consistent-default-export-name`,
  `eslint-plugin-import-newlines` v2 for eslint 10 support).

## Build pipeline (waiting on webpack experiments to stabilize)

Both arrived in the webpack 5.98→5.108 range (checked 2026-07); re-verify
experiment status before starting.

- **Replace `style-loader` + `css-loader` with native CSS** (`experiments.css`,
  `exportType: "style"` injects via `HTMLStyleElement` since 5.106).
  `postcss-loader` stays — it runs Tailwind and autoprefixer, which native CSS
  does not cover. Shrinks `styleLoaderConfig` to one loader plus a generator
  option.
- **Replace `ts-loader` with native type-stripping** (`experiments.typescript`,
  since 5.108; uses Node's type erasure). Stripping handles erasable syntax
  only; live code is enum-free since `src/LogAnnotationKeys` was deleted in
  the 2026-07 logging rewrite, so the remaining `enum`s (`src/type/UI`,
  `src/type/Primitive`) sit in the build-excluded filter-editor WIP and only
  block this if that WIP ships (its `const`-object refactor is worth doing
  regardless — TypeScript's `erasableSyntaxOnly` direction). fork-ts-checker
  remains the type gate either way; stripping does no checking.

## flow-youtube-chat wishlist

A wishlist, not commitments; verify against `src/` before starting one.

- Reduce build size
- Display matrix
- Auto block user
- Per site settings
- Auto reload
- Banned lane
- Sticker support
- Performance tab
- Reset default settings
- Shadow color v2
