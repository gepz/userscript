---
'@userscript/flow-youtube-chat': minor
---

Migrate the reactive layer from rxjs to Effect Stream. The rxjs CDN
`@require` and webpack external are gone; the `tapEffect`/`concatMapEffect`
adapters (which escaped the Effect runtime with a `runPromise` per event) are
replaced by in-runtime `Stream.tap`/`Stream.mapEffect`. Config change
notification moved from per-key Subjects to SubscriptionRefs, and the config
side effects (setting-panel dispatch, filterExp rebuild on banned-list
changes) moved from the shared `share()`d read path to the write funnel
(`src/configWriteFunnel`, now unit-tested), so they can no longer be missed
during pipeline rebuild windows. Deliberate behavior changes: reinit
events are buffered in a queue instead of
dropped while resubscribing, the retry loop now also recovers from defects
(thrown exceptions) instead of only typed failures, and the filterExp
rebuild reads the banned list after it is stored (previously it could act on
the pre-write value when effects were composed eagerly).
