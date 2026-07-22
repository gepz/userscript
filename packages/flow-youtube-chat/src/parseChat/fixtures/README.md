# parseChat fixtures

One `<slot>.html` fragment per renderer kind `parseChat` distinguishes. The
spec (`../index.spec.ts`) mounts each fragment and asserts the extracted
`ChatData`, so these files pin the selector contract parseChat is written
against: descendant classes named after the host renderer tag (polymer
style-scope), plus the `#author-photo`, `#author-name`, `#timestamp`,
`#message`, `#card`, `#header`, `#content` and purchase-amount ids.

A fragment has one of two provenances:

- **Synthesized** (no marker comment): hand-written from the assumed
  contract. Tests parseChat's logic, but shares its assumptions, so it can
  never catch YouTube markup drift.
- **Captured** (first line `<!-- captured YYYY-MM-DD -->`): real markup from
  a live page, anonymized by `@/fixtureCapture/sanitize`. Structure, tags,
  ids and classes are verbatim from YouTube; every value the spec asserts on
  (author names, photo-URL tokens, amounts, message bodies, timestamps,
  colors) is rewritten to the canonical values below, so captures drop in
  with zero spec edits. A failing spec after a capture means parseChat
  disagrees with real markup — fix parseChat (or its spec), not the fixture.

Two things stay synthetic even in captures:

- **Colors.** Real renderers are colored by YouTube's stylesheet, which the
  happy-dom spec never loads, so the sanitizer injects canonical inline
  `background-color`s / custom properties instead. What the capture upgrades
  is which of `#header`/`#card`/`#content` exist and where — the structural
  input to parseChat's precedence chains.
- **`#message` contents.** parseChat treats them as opaque text/innerHTML,
  and assertions need deterministic values.

happy-dom quirk the styling works around: `getComputedStyle` resolves inline
styles only for attached elements, and unstyled elements yield `''` (a real
browser yields `rgba(0, 0, 0, 0)`), so every element the color lookups touch
carries an explicit `background-color`.

## Capturing from a live page

1. `pnpm build-capture`, then install `dist/capture/index.user.js` in your
   userscript manager (it is a separate dev-only script; it never ships).
2. `pnpm capture-server` — writes into this directory. Pass `--refresh` to
   re-capture slots that already have captured fragments.
3. Open a busy YouTube live stream. The badge in the bottom-left corner
   shows progress and the still-missing slots. Common messages land
   immediately (existing chat is scanned on attach); superchats, stickers
   and memberships land whenever one appears, so leave it running — the
   server accumulates across sessions and streams.
4. Re-run `pnpm test` and review the git diff of this directory.

The badge (and the server log) also lists `unknown:` renderer kinds — chat
or ticker children whose tag matches no slot and is not on the
deliberately-unmodeled list in `@/fixtureCapture/main`. No test can catch
tag-level drift: an unrecognized renderer is simply never captured, so the
suite stays green on stale fixtures. This line is the discovery signal that
the slot enumeration itself needs a new entry. The first raw occurrence of
each unknown tag is saved to `capture-snapshots/` as `unknown-<tag>.html`,
so the decision (new slot vs deliberately unmodeled) can be made from its
actual markup; delete the file to collect a fresh copy.

## Raw whole-DOM snapshots

Once per page load (30s after the chat attaches) the capture script also
sends the entire `yt-live-chat-app` element, UNSANITIZED, and the server
writes it to the gitignored `capture-snapshots/` directory in the package
root. Use it to inspect unknown renderers' internals, the chat shell the
`@/livePageYt` lookups depend on, or anything the per-slot fixtures don't
model. It contains real user content (names, avatars, messages) — that is
the point, and why it must stay local: never commit or share one as-is;
derive a redacted fixture from it instead if something needs to be pinned
by a test. Reload the page for a fresh snapshot; delete old files freely.

Each slot capture also drops an unsanitized twin of the same element there
as `slot-<name>.html`, so every fixture has a raw original to audit the
sanitizer against.
