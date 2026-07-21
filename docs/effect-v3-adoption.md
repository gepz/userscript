# Effect v3 API adoption opportunities (2026-07)

What newer `effect` APIs could simplify existing code, found by cross-referencing
the 3.6.0–3.22.0 changelog against this repo. Most flow-youtube-chat code was
written against effect ≤3.5 idioms (with a long stop at 3.12.7), so two years of
additions are largely unexploited; every API named here was verified present in
the installed 3.21.4 typings. Scope: live code only — the build-excluded editor
WIP (`tsconfig.exclude.json`) and the deliberately-rxjs `custom-sort` are out.
Companion to `docs/effect-v4-scan.md`: items note where an adoption also shrinks
the planned v4 migration. 3.22.0 itself adds only `Graph` changes — the upgrade
is free but affords nothing below.

## High value

- **`Logger.withLeveledConsole` (3.8)** replaces `metaLogger`'s six-branch
  `getConsoleLog` ternary (level → `console.*` routing). Partial: the
  meta-dependent parts (suppressing sub-Warning entries without meta,
  appending meta as a second console argument) remain custom. Since the v4
  scan already plans a `provideLog`/`metaLogger`/`logWithMeta` rewrite as a
  unit (FiberRef removal), fold this in there rather than churning the file
  twice; `Context.Reference` (3.11) is the v3-available home for `logMeta`
  that pre-aligns with v4's `FiberRef` replacement.

## Structural (bigger than one function)

- **One runtime instead of threading `provideLog`.** `provideLog` is passed as
  an explicit parameter through `initialize` → `allStream` → `configStream`
  and wrapped around ~15 individual effects, because effects started at
  detached roots (`Z.runPromise` in `metaLogger`/`eventLogger`, hyperapp
  handlers like `toggleSettingsPanelComponent`, module-load `banButton`)
  would otherwise miss the logger context. A `ManagedRuntime.make(logLayer)`
  built once serves those roots (`runtime.runPromise`), the main fiber tree
  inherits the layer from a single top-level provision, and the parameter
  threading disappears. `Effect.Service` (3.9) is the matching idiom if the
  `ctx` record `allStream` receives ever moves into context. Same scheduling
  note as above: this touches exactly the files the v4 logging rewrite
  touches — do them together.

## Checked, not applicable

- **`stream/throttleLatest` has no v3 replacement.** v3 `Stream.throttle` is
  token-bucket shaping and `Stream.debounce` has different semantics; neither
  matches rxjs `throttleTime({leading, trailing})`. v4's native throttle is
  the tracked candidate (`docs/effect-v4-scan.md`).
- **`allStream`'s `resilient` loop stays.** Decision-backed
  (`docs/decisions.md`): defects must be recovered, which `Stream.retry`
  ignores.
- `DateTime` (3.6): no raw date math in live code; `flowDuration`'s plain
  milliseconds feed the Web Animations API, where numbers are the right type.
- No fit found for the other new modules in range: `Mailbox`, `ExecutionPlan`,
  `LayerMap`, `Graph`, `HashRing`, `TSubscriptionRef`, `Micro`.
- **Schema for `simpleConfig`.** The other trust boundaries (`Log.importLog`,
  `indirectConfig`, the `lang` key) are schema-validated (2026-07; bundle
  cost of the adoption measured at +16.6 KB / +2.2% prettified).
  `simpleConfig` still trusts the `GM.getValue(key, default)` overload's
  return type, which lies if storage holds a wrong-typed value; validating
  would need a schema switched on `typeof defaultValue` behind a cast.
  Adopt only if wrong-typed simple values ever actually bite.
- **The smaller wins are done (2026-07)**: yieldable refs in generators
  (`yield * someRef` — kept `Ref.get` only in `throttleLatest`, whose ref is
  named `window` and would read as the global), `Number.round` in `ui`'s
  `rangeRow` (output verified identical across the range-config domain; the
  one divergence, `-0` → `0`, is an improvement), `O.firstSomeOf` in
  `parseChat`, `A.mapAccum` in `chatNode` (also drops the quadratic vnode
  spreading), `A.getSomes` flag-dispatch in `configStream`. Declined: `Match`
  for `evaluateExpression`'s `switch` — exhaustiveness isn't needed and the
  switch is fine.
- **Traced `Effect.fn` beyond `removeOldChats`.** Decided during adoption
  (2026-07): per-chat functions (`getChatLane`, `chatNode`,
  `setNewChatAnimation`, `setChatPlayState`, `onChatFieldMutate`'s callback)
  stay untraced — a span per chat is not free on hot paths — and
  `initialize`'s `reinitialize` is a trivial `Z.sync` that cannot fail, so a
  span there adds nothing. Revisit only if failure attribution proves
  insufficient in practice.
