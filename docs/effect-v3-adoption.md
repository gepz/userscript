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

- **Traced `Effect.fn` (3.11) where failure context matters.** The
  generator-shaped `(args) => Z.gen(...)` wrappers are converted to
  `Z.fnUntraced` (`getChatLane`, `chatNode`, `onChatFieldMutate`'s per-chat
  callback, the inner function of `allStream`, plus the two prior adoptions).
  What remains is a judgment call, not mechanics: upgrading cold-path
  functions (e.g. `removeOldChats`, the reinit flow) to traced
  `Effect.fn("name")` gives each call a named span, so the `Cause.pretty`
  output in `allStream`'s `resilient` handler and the terminal handler gains
  a real trace instead of an anonymous stack. Skip hot per-chat paths — a
  span per call is not free. Non-generator arrows returning `pipe(...)`
  (`removeOldChats`, `setNewChatAnimation`, `setChatPlayState`) gain nothing
  from `fnUntraced`; convert them only if adopting traced spans.
  v4-aligned (`Effect.fn` is core v4 idiom).

- **`Stream.mergeWithTag` (3.8.5) + `Effect.whenLogLevel` (3.13) for the
  per-key config debug streams** (`allStream`, the `configKeys → A.map`
  block). `Stream.mergeWithTag` merges a struct of streams into one stream of
  `{ _tag: key, value }`, replacing the per-key closure and its
  `SubscriptionRef<unknown>` cast with one `Record.map` over `configRefs`.
  Wrapping the handler in `Z.whenLogLevel(LogLevel.Debug)` also stops
  computing `configDiff` + `JSON.stringify(x, undefined, 2)` on every config
  change when debug logging is disabled — today that work runs regardless.

- **`Stream.asyncPush` (3.6) to replace the `stream/observePair` bridge.**
  observePair hand-builds observer → `PubSub.publish` → `Stream.fromPubSub`.
  `Stream.asyncPush` was added for exactly this: register the observer in an
  `acquireRelease`, call `emit` from the callback, and get `disconnect` as a
  scoped finalizer for free. The setup-time `observe`/`disconnect` choreography
  in `allStream` is unaffected (it manages *what* is observed, not the
  bridge). Check buffering before switching: asyncPush buffers via
  `bufferSize`/`strategy` options, and MutationObserver bursts must not be
  dropped where the PubSub today is unbounded.

- **`Schema` (in core since 3.10) for the trust boundaries.** Three inputs are
  currently cast, not validated:
  - `Log.importLog` runs `JSON.parse(x) as LogExport` on text pasted into a
    `prompt()` — the clearest candidate: `Schema.parseJson(LogExportSchema)`
    turns malformed pastes into a typed failure instead of a defect or silent
    corruption (`decompressBlock` has the same shape internally).
  - `indirectConfig` casts `GM.getValue` results (`as Promise<T1 | undefined>`)
    and only defaults on `undefined`; a per-item schema validates stored
    values that may predate format changes.
  - the `lang` config key validates via `languages.includes` with double
    casts (`defaultGMConfig`) — `Schema.Literal(...languages)` is the direct
    form.
  Cost caveat: effect is bundled and tree-shaken (not a CDN `@require`), and
  Schema is one of the heavier subtrees. Two `Schema.instanceOf` sites already
  pull in some of it, but measure with the commented-out `BundleAnalyzerPlugin`
  in `webpack.config.prod.ts` before adopting broadly.

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

## Smaller wins

- Yieldable subtypes (3.8–3.9): `yield* someRef`, `yield* someQueue` etc.
  now work directly in `Z.gen`, dropping `SynchronizedRef.get`/`Queue.take`
  noise in generator code. Survives v4 (yieldables stay; only
  Effect-assignability goes).
- `Number.round` (3.8): `ui`'s `rangeRow` trailing-zero trim
  (`toFixed(4).replace(/\.?0+$/, '')`) is `String(N.round(x, 4))` — verify
  the exponent-notation edge for very small values first.
- Long-available but unused, worth using on next touch: `O.firstSomeOf` for
  `parseChat`'s stacked `O.orElse` color fallbacks; `A.mapAccum` for
  `chatNode`'s manual length-accumulating `A.reduce`; `A.getSomes` over
  `O.some`/`O.none` instead of `Z.allSuccesses` +
  `Z.fail(new Cause.NoSuchElementException())` as flag-dispatch in
  `configStream`; `Match` for `evaluateExpression`'s 10-case `switch` if
  exhaustiveness checking is wanted (the switch is otherwise fine).

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

## Housekeeping found during the scan

- `src/filterOption/index.ts` is an empty file with no importers — delete.
- Comments in `stream/{observePair,videoToggleStream,throttleLatest}` still
  cite behaviors from `stream-behaviors.md`, deleted in 4515813 — rewrite
  them to state the constraint directly.
