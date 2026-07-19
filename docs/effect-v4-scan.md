# Effect v4 migration pre-scan (2026-07)

Scanned against effect-smol `main` (v4 beta) — its `MIGRATION.md` plus the
`migration/*.md` topic docs, and the v4 module sources for the APIs this
repo uses. v4 is beta; re-verify each item when migrating (the guide says
APIs may still change). Affected packages: `flow-youtube-chat` and `ui`
(`custom-sort` has no effect dependency).

## Semantic changes (real work)

- **Effect subtyping is gone (`migration/yieldable.md`).** In v3 `Option`,
  `Either`, `Ref`, `Fiber` were structural subtypes of `Effect`; in v4 they
  are only `Yieldable` (usable with `yield*`) or plain values, and are NOT
  assignable to `Effect`. Live code was restructured off Option-as-Effect
  in 2026-07 with the transpose family (`livePageYt`, `allStream`'s
  `pollChanged` and setup mounts, `scaleChatField`), so the expected
  fallout is now small — the compiler arbitrates any stragglers at
  migration time. The excluded filter-editor WIP still leans on the
  subtyping (e.g. `restrictedExpression/CallExpression`), which is part of
  why deciding its fate (backlog) is a migration prerequisite.
- **`FiberRef` family removed (`migration/fiberref.md`).** `FiberRef`,
  `FiberRefs`, `FiberRefsPatch` are replaced by `Context.Reference` /
  built-in `References.*`. Hits the logging stack: `LogMeta`'s
  `FiberRef.unsafeMake`, `metaLogger`'s `FiberRefs.getOrDefault(context,
  logMeta)` (the logger callback's `context` shape changes too), and
  `withMinimumLogLevel` (→ `References.MinimumLogLevel`). Plan to rewrite
  `provideLog`/`metaLogger`/`logWithMeta` as a unit.
- **`Cause` flattened (`migration/cause.md`).** Now
  `{ reasons: ReadonlyArray<Fail | Die | Interrupt> }`; no
  Sequential/Parallel tree. We use `Cause.pretty` and `Cause.squash` in
  `allStream`'s resilient wrapper, `initialize`'s terminal handler, and
  `provideLog` — the migration doc doesn't say whether pretty/squash
  survive; verify and adapt.
- **`@effect/typeclass` has no v4 counterpart** (not in the effect-smol
  workspace; v4 core offers `Combiner`/`Reducer` instead). Live consumer:
  `flow-youtube-chat/src/filter/filterOperators` (Semigroup) — port or
  inline. The other 7 consumers are the excluded typed-expression-editor
  WIP (`src/type/*`, `src/typedExpression/*`): decide that WIP's fate
  (backlog item) before migrating, or the migration inherits ~3.2k lines
  of dead porting work.

## Mechanical renames (compiler-guided, low risk)

| v3 (uses in repo) | v4 |
|---|---|
| `Either` (~35 call sites, 22 imports) | `Result` (`right`→`succeed`, `left`→`fail`) |
| `Effect.zipRight` (20) | `Effect.andThen` |
| `Effect.zipLeft` (5) | `Effect.tap` |
| `catchAllCause` (2) / `tapErrorCause` | `catchCause` / `tapCause` |
| `Effect.forkDaemon` (2) | `Effect.forkDetach` |
| `Queue.unsafeOffer` | `Queue.offerUnsafe` (Unsafe is now a suffix convention) |
| `Stream.async` | `Stream.callback` |

## Verified survivors (no change expected)

- Whole Stream surface we use: `fromEventListener`, `fromSchedule`,
  `fromQueue`, `fromPubSub`, `zipWithPrevious`, `mergeAll`, `flattenTake`,
  `flatMap` `switch` option, `retry`. v4 also ships a native
  `Stream.throttle` — check whether it matches rxjs
  `throttleTime({leading, trailing})` semantics and can replace our
  `stream/throttleLatest` (its spec suite is the arbiter).
- `SubscriptionRef` (incl. `.changes`), `SynchronizedRef`, `PubSub`,
  `Take`, `Schedule`, `Struct.entries`, `TestClock` (now
  `effect/testing`), and `@effect/vitest` lives in the same workspace.
- `Optic` is core in v4 (replaces frozen `@fp-ts/optic`, only used by the
  WIP editor via `Op.Optional` behind local helpers).
- Single-version ecosystem: the `@fp-ts/optic` peer-floor warning class
  disappears.

## Watch items

- Fork fibers now default to different lifecycle handling (fiber
  keep-alive doc is Node-process oriented; likely irrelevant in the
  browser, but re-check the forked `Stream.runDrain` daemon and the 10 s
  heartbeat in `initialize`).
- `Logger.make`/`Logger.replace`/`Logger.zip`/`annotateLogs`: not covered
  by the migration docs; verify against v4 `Logger.ts` when starting.
- Defect-vs-failure semantics of the resilient reinit loop (recursive
  `catchCause`) should be re-probed like the v3 probes that shaped it.

Discord threads are mirrored as `From Discord:` issues on
`Effect-TS/effect-smol` and the raw threads are indexed on
answeroverflow.com — search both when something above is undocumented.
