# Backlog

Repo-level work worth doing, roughly ordered. Feature wishlists live with
their packages (e.g. `packages/flow-youtube-chat/plan.md`). Remove items when
done; re-verify versions before starting, this list ages.

## Security / correctness

- **hyperapp is dormant upstream** (2.0.22 final, typings papered over by
  `hyperappDomCompat.d.ts`). Long-term: migrate off or vendor.

## Design decisions pending

- **Decide the fate of the typed filter-expression editor WIP** in
  flow-youtube-chat (~3.2k lines across `src/type`, `src/typedExpression`,
  `src/restrictedExpression`, `src/settingUI/{filter,filterPanel,EditableExpression}`,
  `src/filter/filterContextType`; all excluded via `tsconfig.exclude.json`).
  With `expression-eval` replaced by `jsep` + `src/filter/evaluateExpression`,
  this is editor UX work, not security work. Options: finish as designed
  (generic type inference; two files still have mid-edit syntax errors),
  rescope to first-order type checking in direct-style TypeScript, or delete
  the WIP after folding its design into `plan.md`. See the "In flight"
  section of `packages/flow-youtube-chat/plan.md`.

## Dependency majors (deferred deliberately)

- `webpack-bundle-analyzer` 5: ships no typings — see `docs/decisions.md`.
- Effect v4 (beta since early 2026, will be LTS): single-version ecosystem,
  much smaller core, and a built-in `Optic` module that replaces the frozen
  `@fp-ts/optic` (v0.25.0, stale peer floor). Migrate when v4 is stable,
  not during beta. Pain points pre-scanned in `docs/effect-v4-scan.md`
  (2026-07): the big items are Option-as-Effect subtyping removal, the
  `FiberRef`→`Context.Reference` logger rewrite, `Either`→`Result`, and
  `@effect/typeclass` having no v4 counterpart — which makes deciding the
  filter-editor WIP's fate (above) a prerequisite.
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
  since 5.108; uses Node's type erasure). Blocked on refactoring the three
  `enum`s in flow-youtube-chat (`src/type/UI`, `src/type/Primitive`,
  `src/LogAnnotationKeys`) to `const` objects + union types — stripping
  handles erasable syntax only. That refactor is worth doing regardless
  (TypeScript's `erasableSyntaxOnly` direction). fork-ts-checker remains the
  type gate either way; stripping does no checking.

## Housekeeping

- **Adopt newer effect v3 APIs** per `docs/effect-v3-adoption.md` (2026-07).
  Done: everything actionable, including the pre-v4 transpose restructure of
  the live-code Option-as-Effect sites, Schema at the trust boundaries, and
  the smaller wins; declined candidates are recorded in the doc's "Checked,
  not applicable" section. Remaining: the logging/runtime items, which fold
  into the v4 migration's logging rewrite (`docs/effect-v4-scan.md`) rather
  than standing alone.
