---
name: verify
description: Run the built flow-youtube-chat userscript against a local fake watch page and drive the settings panel headlessly with Playwright.
---

# Verify flow-youtube-chat in a browser

The userscript needs a YouTube watch page; a minimal local fake satisfies
every element it polls for (`src/livePageYt/index.ts` is the full DOM
contract). No network or real YouTube needed.

## Harness

Create a directory with:

1. `pnpm run build-webpack` output: copy `dist/main/index.user.js`.
2. The four `@require` globals from `node_modules`:
   `astring/dist/astring.min.js`, `jsep/dist/iife/jsep.iife.min.js`,
   `hash-it/dist/umd/index.js`, `lz-string/libs/lz-string.min.js`.
3. `index.html` loading, in order: a `GM` shim, the four libs, the fake
   DOM, then `index.user.js`. GM shim: implement
   `GM.{getValue,setValue,deleteValue,listValues,setClipboard}` as async
   fns over a JSON object in `localStorage` (key `gmstore`) — this also
   gives you config persistence across reloads and an inspectable store.
4. Fake DOM (ids/classes exactly): `#movie_player` containing
   `video.video-stream.html5-main-video` and `.ytp-right-controls`;
   `#menu-container` containing `.dropdown-trigger.ytd-menu-renderer`
   (both must be visible — offsetParent checks); `yt-live-chat-app`
   containing `#item-scroller.yt-live-chat-item-list-renderer` >
   `#items.yt-live-chat-item-list-renderer` and
   `#ticker-items.yt-live-chat-ticker-renderer`. Style the custom
   elements `display: block`.

Serve over HTTP (`python3 -m http.server`), not `file://`.

## Driving

Playwright module may only exist in the npx cache
(`find ~/.npm/_npx -maxdepth 3 -name playwright -type d`); run drivers
with `NODE_PATH=<that node_modules> node drive.cjs`, and if the browser
build revision mismatches, pass `executablePath` pointing at whatever is
in `~/.cache/ms-playwright/`.

- Settings toggle: `#menu-container button.fyc_button` (another
  `.fyc_button` lives in the player controls — scope the selector).
- Panel: `.fyc_panel`; tabs are spans by visible text (Chat Flow, Chat
  Appearance, Chat Filter, Chat Window, Feedback).
- Rows are label-span + error-span + inputs; address inputs by XPath from
  the label, e.g.
  `//span[text()="Speed"]/following::input[@inputmode="decimal"][1]`.
- Commit = `fill()` then `blur()` (fires change). Invalid input shows as
  `borderColor: rgb(255, 85, 85)`; row error text is the label's
  `following-sibling::span[1]`.
- Config writes land in `localStorage.gmstore` under legacy key names
  (`FYC_SPEED`, `FYC_COLOR`, `FYC_NG_WORDS`, `FYC_EXCLUDED_LANES`,
  `FYC_LANE_DIV`, `FYC_filterExp`, ...). Banned-list edits also rebuild
  `FYC_filterExp` — a good end-to-end signal.
- Collect `page.on('pageerror')` — the script logs errors rather than
  crashing, so an empty pageerror list plus expected store writes is the
  pass signal.

## Gotchas

- `dist/` is gitignored and nothing auto-rebuilds — always
  `build-webpack` and re-copy the bundle into the harness before
  driving, or you verify stale code.
