# Stream-layer behavior inventory (rxjs → Effect Stream migration)

This is the migration contract: every observable behavior of the current rxjs
layer, with how each one is preserved. Written against the code as of the
migration start; delete this file when the migration is complete and the
`spec` rows live on as tests.

Preservation tags:

- **spec** — covered by a `*.spec.ts` test (colocated with the new primitive).
- **manual** — verified by smoke-testing on a live/replay YouTube chat page;
  not automatable without a DOM harness.
- **types** — the compiler enforces it (record completeness over config keys).
- **changed** — deliberately different after migration; rationale inline.

## 1. Config write path (`initialize`)

| ID | Behavior | Tag |
|----|----------|-----|
| W1 | `setConfigPlain[key](v)` mutates `configValue[key]` in place, *then* emits `v` on `configSubject[key]`. A subscriber reacting to the emission always sees `configValue` already updated. | spec (`configWriteFunnel`) |
| W2 | `changedConfigMap` skips everything (no mutation, no emission, no persistence) when `fast-deep-equal` says the new value equals `configValue[key]`. | spec (`configWriteFunnel`) |
| W3 | `setChangedConfig` = dedup + local write only — no broadcast, no GM write. Used for values *received* over BroadcastChannel, so broadcasts cannot loop. | spec (`configWriteFunnel`) |
| W4 | `mainState.config.setConfig` = dedup + local write, then `channel.postMessage([key, val])`, then `GM.setValue(gmKey, toGm(val))` — in that order, all skipped when deduped. | spec (`configWriteFunnel`; broadcast/persist injected) |
| W5 | At startup, `filterExp` is set unconditionally (no dedup) to `defaultFilter(configValue)` after GM values load. | manual |

## 2. Config read path (`co` in `initialize`)

| ID | Behavior | Tag |
|----|----------|-----|
| R1 | `configSubject[key]` is a plain `Subject`: no initial value, no replay. Call sites that need the current value bolt on `startWith(...)` (configStream `fieldScale`/`flowX1`; allStream diff-log). | types — exact parity: `SubscriptionRef.changes` emits the current value first, so `startWith` sites take `.changes` directly and plain-Subject sites take `.changes` + `Stream.drop(1)` (`changed()` in configStream). The diff-log branch needs neither: `zipWithPrevious` + filter-on-`Some` reproduces `bufferCount(2, 1)` exactly. |
| R2 | Each `co[key]` carries a side effect on every emission, `share()`d so it runs once per emission no matter how many branches subscribe: (a) dispatch `setSettingFromConfig(k)(v)` into all setting apps; (b) if `k` ∈ {bannedWords, bannedUsers, bannedWordRegexes}, rebuild `filterExp = defaultFilter(config)` via the *full* `setConfig` path (broadcast + GM persist). | **changed** — side effects live on the write path (`src/configWriteFunnel`), the single funnel all writes pass through. Same once-per-write guarantee without `share()`, and hooks can no longer be missed during branch-rebuild subscription gaps. spec |
| R3 | The R2 side effect is deferred with `setTimeout(…, 0)` and fire-and-forget `runPromise` — it runs on a later macrotask than downstream subscribers, and its failures vanish. | **changed** — write-path effects run sequenced in the runtime after the ref set, with failures surfacing through the write effect. No re-entrancy: SubscriptionRef subscribers pull asynchronously. The filterExp rebuild is `Z.suspend`ed so the default filter is computed after the banned list is stored (the spec caught the eager-evaluation variant reading the old list). spec |

## 3. Broadcast receive (`allStream` branch 1)

| ID | Behavior | Tag |
|----|----------|-----|
| B1 | `channel` `'message'` events `[key, val]`: applied via `setChangedConfig` only when `key` ∈ `listeningBroadcastConfigKeys`; other keys are dropped. | manual |
| B2 | `broadcast-channel` does not deliver a message back to the instance that posted it (environment assumption, unchanged). | manual |

## 4. Reinit lifecycle and retry (`allStream` skeleton)

| ID | Behavior | Tag |
|----|----------|-----|
| L1 | `reinitialize` schedules `reinitSubject.next()` on the next animation frame; N calls in one frame window produce N events. Emissions while nobody is subscribed are dropped (plain Subject; the first `reinitialize` runs after `.subscribe`). | **changed** — the reinit channel is an unbounded `Queue<void>`: events during teardown/retry windows are buffered instead of dropped (at worst an extra idempotent rebuild), which removes the subscribe-before-rAF race the Subject version relied on. rAF scheduling and N-calls→N-events kept. |
| L2 | Each reinit event: async hop + 100 ms delay + `logInfo('Init')`, then **switchMap** — the previous polling loop and the whole branch tree below it are torn down (DOM listeners removed, throttle state discarded) and rebuilt. | manual |
| L3 | Element polling: every 700 ms, read all `LivePage` elements, update the `ele` caches, log `"<key> found/lost"` per change (reference equality via `strictOptionEquivalence`), and emit only when at least one element changed. `startWith(0)` makes the downstream setup run immediately on (re)init without waiting for a change. | manual |
| L4 | Every poll tick also runs `tapUpdateSettingsRect`: read current `settingsRect` (BehaviorSubject `first()` = current value), recompute from the toggle element's bounding rect, write back only when changed (`updateSettingsRect` no-ops on equal rects). | manual (`first()` becomes `SubscriptionRef.get`) |
| L5 | **Every emitted poll tick** (element change or the initial `startWith`) re-runs the "Loading..." setup *and* — via the second `switchMap` at `allStream` line 246 — tears down and rebuilds all nine merged branches. Setup: disconnect all four observers, re-observe `document` (childList+subtree), append css, then `Z.allSuccesses` (per-item failure tolerated): observe chatField/chatTicker, prepend chatScreen into player, mount the three apps (settings toggle falls back to before the chat button), observe body, and set `chatPlaying` = video present ∧ (¬paused ∨ offlineSlate present). | manual — the migrated setup must be `Z.suspend`ed: a fixed effect value captures the empty element caches from construction time (an `Option` used as an Effect is a frozen value, unlike a per-emission rxjs callback), and every mount then fails silently inside `allSuccesses`. Caught by the first smoke test: CSS appended, no UI. |
| L6 | `retry({delay})` with no count = infinite: on any pipeline error, log at Error level, wait 5000 ms, call `reinitialize`, resubscribe the whole chain from `reinitSubject`. | manual — recursive `Stream.catchAllCause` loop (log → sleep 5 s → reinitialize → re-run). Deliberately catches defects too: a thrown exception in a branch effect is a failure in rxjs but a defect in Effect, and `Stream.retry` alone would let it kill the pipeline permanently. |
| L7 | Terminal `.subscribe`: error → `Stream Errored` log; complete → `Stream complete` warning. Both defensive (subjects never complete; retry never exhausts). | manual (`Stream.runDrain` forked in the same Effect program) |

## 5. Merged branches (all concurrent, rebuilt per L5)

| ID | Behavior | Tag |
|----|----------|-----|
| M1 | Per-key diff logging: `startWith(current)` → `bufferCount(2, 1)` pairwise → microdiff for object/array roots, hand-rolled root-level `CHANGE` entry for primitives → `logDebug` JSON. First write after subscription pairs with the value at subscription time. | spec (`configDiff`); pairing via `Stream.zipWithPrevious` + filter-on-`Some` |
| M2 | Video toggle: wired only if the video element is cached at branch-build time. `playing` → `true`; `waiting`/`pause` → `false`; `chatPlaying = playing ∨ offlineSlate present`; effect sets the `chatPlaying` ref then `setChatPlayState` on every live flow chat. | spec (event→bool mapping) + manual |
| M3 | Chat mutations: each MutationObserver batch → `onChatFieldMutate`, strictly sequential (A1). | manual |
| M4 | URL change: document mutations → `location.href` → `distinctUntilChanged` → `skip(1)` (baseline = href at branch build; only *changes* trigger) → settings-rect update → log + `removeOldChats(0)` (clear all) → 1700 ms delay → `reinitialize`. | manual |
| M5 | Player resize: throttle 500 ms leading+trailing (T1) + `startWith([])` → read player bounding rect → `onPlayerResize`. | manual |
| M6 | Body resize: throttle 300 ms leading+trailing + `startWith([])` → settings-rect update. | manual |
| M7 | `settingsRectSubject` (BehaviorSubject seeded with the default panel rect): every value → dispatch `panelRect` into setting apps. New subscribers get the current value immediately. | manual (`SubscriptionRef`) |

## 6. configStream

| ID | Behavior | Tag |
|----|----------|-----|
| C1 | Built inside `defer` — fresh operator state per subscription (rebuilt on every L5 rebuild). | manual (Stream is lazy per-run by construction) |
| C2 | banned\*, `lang`, `maxChatLength`, `simplifyChatField`, `createBanButton`, `createChats`, `fieldScale` pass through with no local effect; `fieldScale` is merged twice — harmless duplicate. | **changed** — removed. These merges existed only to hold a subscription so the `share()`d read-path side effects (R2) would run; with the effects on the write path they were dead pass-throughs. |
| C3 | `fieldScale`: `startWith(current)` → `scaleChatField` effect per value. | manual |
| C4 | Flag machine: three groups map keys to `{render, setAnimation}` / `{render}` / `{setPlayState}` / `{setAnimation}` partial flags; `flowX1`/`flowX2` additionally repaint `chatScreen.style` left/width inline (`flowX1` with `startWith(current)`, `flowX2` without). | manual |
| C5 | Flag stream throttled 180 ms leading+trailing; **flags of dropped intermediate events are lost, not unioned** (trailing = last event's flags only). Existing quirk, preserved as-is by T1. | spec (T1 trailing-latest) |
| C6 | Per emission, defaults filled (`false`), then for every flow chat whose `animationState` is `Right`: `render` → `renderChat`; `setAnimation` → `setChatAnimation`, else `setPlayState` → `setChatPlayState`. | manual |

## 7. Adapters and effect execution

| ID | Behavior | Tag |
|----|----------|-----|
| A1 | `tapEffect`/`concatMapEffect`: effects run strictly sequentially per stream (concatMap), input order preserved, unbounded buffering while an effect runs; effect failure becomes a stream error feeding L6. `tapEffect` passes the input through; `concatMapEffect` emits the result. | spec-by-construction (`Stream.tap`/`Stream.mapEffect` are sequential and in-runtime — the `Z.runPromise` seam disappears) |
| A2 | `observePair`: observer callback pushes into a plain Subject — delivered to current subscribers only, **dropped when nobody is subscribed** (teardown/rebuild windows, L2/L5). Each pair has exactly one subscriber today. | spec (PubSub-based replacement keeps drop-when-unsubscribed) |
| A3 | `settingUpdateApps` BehaviorSubject: only `.value`/`.getValue()` reads and `.next` writes — never subscribed. | types (becomes a plain `Ref`) |
| A4 | `eventLogger`/`provideLog` are Logger-layer, not stream-layer: `runPromise` inside `Logger.make` stays. | unchanged |

## 8. Timing primitives

| ID | Behavior | Tag |
|----|----------|-----|
| T1 | `throttleTime(d, {leading: true, trailing: true})` (used at 180/300/500 ms): first event of a burst emits immediately and opens a window of `d`; the latest event arriving during the window emits when it closes and opens a new window; a window closing with nothing pending ends the train (next event is leading again). A lone event is emitted exactly once. | spec (`throttleLatest` combinator, TestClock) |
| T2 | 100 ms init delay, 700 ms poll, 1700 ms reinit delay, 5000 ms retry delay, 10 s heartbeat (forked daemon). | manual — `Z.sleep`/`Schedule.fixed`. The 700 ms poll uses `Stream.fromSchedule(Schedule.fixed(...))`, whose first emission comes after one period like rxjs `interval`; `Stream.tick` emits immediately and would double the initial setup. |

## 9. Manual smoke-test procedure

Covers every `manual` row. Preparation: exactly one FYC enabled (disable the
Greasyfork copy), fresh `dist/main/index.user.js` installed, a watch page
with live chat or chat replay. Open the settings panel and enable the
`logEvents` checkbox first — Debug/Info logs (`Init`, `<key> found/lost`,
`Loading...`, `Config <key>: [diff]`, `URL Changed`) only appear in that
event log; the browser console only gets Warning and above.

1. **Startup** (L2, L3, L5, T2, W5, M7): reload the watch page. Within ~1 s
   the chat toggle button appears in the player controls, the settings
   toggle next to the video menu row, and chats flow over the video. Event
   log shows `Init` → `<key> found` lines → `Loading...`. The settings
   panel opens next to its toggle button and shows the persisted values.
2. **Chat flow and play state** (M2, M3, C6): chats from the chat panel
   appear as flowing danmaku. Pause the video (use a replay/VOD): flowing
   chats freeze in place; play resumes them.
3. **Live setting updates** (C3, C4, C5, C6, W1, W4, M1): with chats on
   screen, change `fontSize` / `flowSpeed` / `chatOpacity` — visible chats
   update within ~200 ms; dragging a slider rapidly coalesces (intermediate
   values dropped, final value applied). `fieldScale` rescales the chat
   input field. `flowX1`/`flowX2` restyle the flow area's left/width. Every
   change logs a `Config <key>: [diff]` entry.
4. **Banned words → filter rebuild** (R2/R3 write path): add a word
   currently appearing in chat to `bannedWords` — new matching chats stop
   flowing immediately (the filter must derive from the *new* list). Event
   log shows `Config bannedWords` then `Config filterExp`. Removing the
   word lets them flow again.
5. **Cross-tab broadcast** (B1, B2, W3, W4): open a second watch tab, same
   profile. Change `fontSize` in tab A: tab B's panel shows the new value
   and its chats restyle, without touching tab B. No ping-pong: the value
   settles once, no oscillation. Reload a tab: the change persisted (GM).
6. **URL change → reinit** (M4, L1, L2): click another video via the SPA
   (no hard reload). Flowing chats clear immediately, log shows
   `URL Changed: <href>`, and after ~1.8 s a fresh `Init` → `found` →
   `Loading...` cycle re-mounts the UI on the new video. Also navigate to
   the home page and back — the script recovers on return.
7. **Resize** (M5, M6, L4, M7): toggle theater mode / resize the window.
   Flowing chats reposition to the new player rect within ~500 ms; an open
   settings panel follows its toggle button within ~300 ms.
8. **Chat toggle button**: the player-controls button toggles the danmaku
   off/on, and the state survives a reload.
9. **No errors** (L6, L7): after all of the above, the browser console has
   no FYC `Errored:`/`Stream Errored` lines. The retry loop itself is not
   manually triggerable without injecting a fault; it was verified by
   probe.

## 10. Out of scope

`custom-sort` stays on rxjs (no effect dependency; rxjs arrives via CDN
`@require`; its Subjects are push-native mithril event glue). The
`@userscript/forward-to` package therefore survives until custom-sort moves;
flow-youtube-chat merely stops importing it.
