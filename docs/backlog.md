# Backlog

Repo-level work worth doing, roughly ordered. Feature wishlists live with
their packages (e.g. `packages/flow-youtube-chat/plan.md`). Remove items when
done; re-verify versions before starting, this list ages.

## Security / correctness

- **hyperapp is dormant upstream** (2.0.22 final, typings papered over by
  `hyperappDomCompat.d.ts`). Long-term: migrate off or vendor.

## In progress

- **rxjs → Effect Stream in flow-youtube-chat.** Effect Stream is pull-based
  (rxjs is push); not a blocker — push sources bridge via queue-backed
  adapters (`Stream.fromEventListener`, `Stream.async`, `SubscriptionRef`,
  `PubSub`), and pull semantics replace the `Z.runPromise`-per-event escape
  in `tapEffect`/`concatMapEffect` with in-runtime `Stream.tap`/`mapEffect`.
  Two things need redesign rather than transliteration: hot multicast
  (config side effects move from the `share()`d read path to the
  `setConfigPlain` write funnel) and `throttleTime(leading+trailing)` (custom
  `throttleLatest` combinator). Behavior contract with per-behavior
  preservation strategy: `packages/flow-youtube-chat/stream-behaviors.md`.
  Phases: (1) primitives + tests, (2) rewire `configStream`/`allStream`/
  `initialize`, (3) drop rxjs dep, `@require` line, webpack external, and the
  `tapEffect`/`concatMapEffect`/`forwardTo` usage. `custom-sort` deliberately
  stays on rxjs (no effect dependency, CDN-required, push-native mithril
  glue), so the `forward-to` package outlives this migration.

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
  much smaller core, and a built-in `Optic` module (standalone
  `Optic.id<T>().key(...)` chains plus schema-derived lenses) that can
  replace the frozen `@fp-ts/optic` (v0.25.0, Sep 2024, stale peer floor).
  The typed filter-expression WIP uses `@fp-ts/optic` via `Op.Optional`;
  keep that usage behind local helpers (`ElementOpticPair`,
  `expressionSetter`) so the swap stays mechanical. Migrate when v4 is
  stable, not during beta.
- TypeScript 6.x once typescript-eslint supports it.
- eslint 10: blocked on plugin ecosystem (`eslint-config-airbnb-extended`,
  `eslint-plugin-canonical`, the compat-shimmed
  `eslint-plugin-consistent-default-export-name`,
  `eslint-plugin-import-newlines` v2 for eslint 10 support).

## Housekeeping

- `run-s` occasionally fails with EACCES spawning corepack's `pnpm.cjs`
  (seen in ui's `build`); root-cause or replace `npm-run-all`.
