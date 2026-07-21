# Effect v3 API adoption opportunities (2026-07)

What newer `effect` APIs could simplify existing code, found by cross-referencing
the 3.6.0–3.22.0 changelog against this repo. Most flow-youtube-chat code was
written against effect ≤3.5 idioms (with a long stop at 3.12.7), so two years of
additions were largely unexploited; every API named here was verified present in
the installed 3.21.4 typings. Scope: live code only — the build-excluded editor
WIP (`tsconfig.exclude.json`) and the deliberately-rxjs `custom-sort` are out.
Companion to `docs/effect-v4-scan.md`: items note where an adoption also shrinks
the planned v4 migration. 3.22.0 itself adds only `Graph` changes — the upgrade
is free but affords nothing below.

Everything actionable is adopted as of 2026-07; this doc is now the record of
what was done and what was checked and declined.

## Adopted

- **The logging/runtime rewrite (2026-07)** — the last actionable cluster,
  done as a unit so the files churn once:
  - `LogMeta` is a `Context.Reference` (3.11) instead of a `FiberRef`;
    `logWithMeta` attaches meta with `Effect.provideService` and the logger
    reads it back out of the logging fiber's context. Pre-aligns with v4's
    `FiberRef` removal.
  - `metaLogger` is synchronous: it takes the `Console` service's `unsafe`
    side from the callback's context (the same route as effect's internal
    leveled logger) instead of `Z.runPromise`-ing `Console.*` effects.
  - `provideLog` is gone. `runLogged` holds a `ManagedRuntime.make(logLayer)`
    built once; the main entry runs the whole tree through it and the
    detached roots (hyperapp handlers, module-load `banButton`,
    `toggleChatButton`, `toggleSettingsPanelComponent`) call `runLogged`
    instead of bare `Z.runPromise` — so they now see the logger context they
    previously missed. `withMinimumLogLevel` became the
    `Logger.minimumLogLevel` layer inside that runtime.
  - The constant `FYC` log-annotation round-trip went away with the wrapper:
    `metaLogger` bakes in the prefix and the `LogAnnotationKeys` enum is
    deleted (which also leaves live code enum-free — see the type-stripping
    backlog item).
- **The smaller wins (2026-07)**: yieldable refs in generators
  (`yield * someRef` — kept `Ref.get` only in `throttleLatest`, whose ref is
  named `window` and would read as the global), `Number.round` in `ui`'s
  `rangeRow` (output verified identical across the range-config domain; the
  one divergence, `-0` → `0`, is an improvement), `O.firstSomeOf` in
  `parseChat`, `A.mapAccum` in `chatNode` (also drops the quadratic vnode
  spreading), `A.getSomes` flag-dispatch in `configStream`.

## Checked, not applicable

- **`Logger.withLeveledConsole` (3.8) cannot replace `metaLogger`.** It calls
  the console method with a single argument, so it can express neither the
  meta-as-second-console-argument append (which keeps the object inspectable
  in the browser console) nor the suppression of sub-Warning entries without
  meta. Only its idea — route via the `Console` service's `unsafe` side —
  was adopted (above).
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
- **`Match` for `evaluateExpression`'s `switch`** — exhaustiveness isn't
  needed and the switch is fine.
- **Traced `Effect.fn` beyond `removeOldChats`.** Decided during adoption
  (2026-07): per-chat functions (`getChatLane`, `chatNode`,
  `setNewChatAnimation`, `setChatPlayState`, `onChatFieldMutate`'s callback)
  stay untraced — a span per chat is not free on hot paths — and
  `initialize`'s `reinitialize` is a trivial `Z.sync` that cannot fail, so a
  span there adds nothing. Revisit only if failure attribution proves
  insufficient in practice.
