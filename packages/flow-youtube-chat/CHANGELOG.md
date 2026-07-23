# @userscript/flow-youtube-chat

## 1.22.0

### Minor Changes

- 2ca0d5b: The ban button now appears on superchats, paid stickers, membership
  items and gift purchase announcements — next to the author name (or in
  the header for renderers without one) — instead of only on plain
  messages. Gift redemption messages never get one: the user shown there
  is the gift's recipient, not someone who spoke.
- 7ce9ba8: The "Show ban button" toggle now applies to messages already in the
  chat: turning it on adds the button to them, turning it off removes
  every button — no longer only affecting messages that arrive afterwards.

## 1.21.1

### Patch Changes

- 6f06e40: Seeking in a stream no longer floods the screen. A seek rebuilds the
  chat list by re-inserting around a hundred messages at once — dozens of
  superchats included — most of them above the visible window. Now only
  the visible tail of the rebuilt list flows, exactly the messages you see
  in the chat panel; everything re-inserted further up stays put. Live
  messages, including ones arriving below the visible window while you are
  scrolled up, flow as before.
- a3691a6: Chats whose content loads a moment after insertion (gift announcements,
  some membership items, superchat avatars and styling) are now re-checked
  once they finish loading, and every decision is re-made from the
  completed data: bans hide them (including withdrawing an already-flowing
  chat), the ban button appears on them, member coloring and superchat
  styling apply correctly, and a chat wrongly skipped at insertion flows
  once its identity is complete.

## 1.21.0

### Minor Changes

- 8536348: Membership gift purchase announcements now flow across the video with the
  gifter's name and gift count, and are subject to Banned Users and word
  filters. The per-recipient "received a gift" redemption echoes no longer
  flow (previously they flowed as bare text), so one gift bomb produces one
  flowed announcement instead of dozens of identical lines.

## 1.20.1

### Patch Changes

- 12ee03f: Banning a user now also works by their unique @handle, closing the gap
  where superchats and paid stickers (which no longer carry an author photo,
  and hence no author id) slipped past the ban. A Banned Users row may be a
  legacy avatar token (existing rows keep working unchanged), an @handle, or
  both separated by a space; the ban button now records handle and token
  together, so a ban survives the user changing their avatar. Legacy
  token-only rows additionally hide an id-less superchat once that token has
  been seen alongside its handle in the current stream — and never when the
  same name was seen with several ids.
- 329b9c2: Duplicate detection now uses YouTube's own per-message id, so two distinct
  messages that merely look alike (same text and displayed minute, neither
  with an author photo) are no longer dropped as duplicates.
- 52b55ce: Validate external inputs with schemas: importing a malformed event log now
  fails cleanly (leaving the current log untouched) instead of silently
  corrupting it, and stored settings that fail validation fall back to their
  defaults instead of producing broken behavior.
- Updated dependencies [4a417ed]
  - @userscript/ui@1.1.5

## 1.20.0

### Minor Changes

- a3bdeb3: Replace deprecated `expression-eval` (unmaintained, open security advisory)
  with the maintained `jsep` parser — already CDN-required, previously unused —
  plus a built-in restricted interpreter (`src/filter/evaluateExpression`) for
  user filter expressions. The interpreter only reads own properties (no
  prototype chain, no `__proto__`/`constructor`/`prototype`), rejects `this`
  and bitwise operators, and throws on identifiers missing from the filter
  scope instead of yielding `undefined`. jsep 1.4's typings are patched
  (`export =` to `export default`) to pass the bare-tsc CI gate under ES module
  output.
- 1a8869e: Migrate the reactive layer from rxjs to Effect Stream. The rxjs CDN
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

### Patch Changes

- 89c7301: Dependency majors: hash-it 7 (CDN require path moved to its UMD build),
  micro-memoize 5 (now bundled instead of CDN-required — its v5 UMD depends on
  globals that its dependencies' own UMD builds don't register), type-fest 5.
- ea45e88: Replace abandoned `deep-diff` with `microdiff` (bundled; one CDN require
  fewer). Only used to render config changes in debug logs.
- Updated dependencies [89c7301]
  - @userscript/ui@1.1.4

## 1.19.3

### Patch Changes

- 2510d40: Rebuild on modernized toolchain: dependency bumps (effect, rxjs, zod, and
  other within-major updates), TypeScript 5.9, and restored whole-program type
  checking. Updates the pinned CDN `@require` versions in the userscript
  header.

## 1.19.2

### Patch Changes

- fix problems caused by TrustedHTML assignment requirement on some browsers

## 1.19.1

### Patch Changes

- Fix filter bug

## 1.19.0

### Minor Changes

- add support for Simplified Chinese display language

### Patch Changes

- 5c48122: update dependencies
- Updated dependencies [5c48122]
  - @userscript/forward-to@1.0.4
  - @userscript/tap-non-null@1.0.4
  - @userscript/ui@1.1.3

## 1.18.1

### Patch Changes

- Fix a bug where the flow speed of a chat would reset when chat animation changed, typically when users adjust settings or when player size changes.

## 1.18.0

### Minor Changes

- d9b30b9: Make UI insertion more reliable: Make chat toggle button insertion more reliable. If the usual place to insert the UI settings panel toggle cannot be found, it will be added next to the chat toggle button if possible.

## 1.17.5

### Patch Changes

- 9050eb1: Fix a bug where a chat would not be removed properly when the lane interval became too small during animation, typically when user adjusted settings.

## 1.17.4

### Patch Changes

- 0ecd233: Fix the color of superchats

## 1.17.3

### Patch Changes

- 8a6d5aa: Add back ssri to comply with Greasyfork policies

## 1.17.2

### Patch Changes

- 979598b: Fix ssri bug

## 1.17.1

### Patch Changes

- d15e2f6: Fix the user ID filter.

## 1.17.0

### Minor Changes

- refine chat detection

### Patch Changes

- 4a8d46d: fix a logging bug
- 585837b: update dependencies
- 3885849: change monocle-ts to @fp-ts/optic
- Updated dependencies [585837b]
- Updated dependencies
  - @userscript/tap-non-null@1.0.3
  - @userscript/forward-to@1.0.3
  - @userscript/ui@1.1.2
