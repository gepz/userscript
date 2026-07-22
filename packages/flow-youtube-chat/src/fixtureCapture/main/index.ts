import {
  Effect as Z,
  Option as O,
  Schema as S,
} from 'effect';

import Slot, {
  slots,
} from '@/fixtureCapture/Slot';
import sanitize from '@/fixtureCapture/sanitize';
import slotFor from '@/fixtureCapture/slotFor';
import livePageYt from '@/livePageYt';

// Dev-only capture userscript entry (dist/capture, built by
// config/webpack.config.capture.ts, never shipped). Feeds sanitized live
// renderer markup to the ingest server; the workflow is documented in
// src/parseChat/fixtures/README.md.

// Must match the port constant in @/fixtureCapture/server.
const serverBase = 'http://localhost:8931';

const statusResponse = S.parseJson(S.Struct({
  captured: S.Array(S.String),
  unknown: S.Array(S.String),
}));

// Renderer kinds known to exist that the fixtures deliberately do not
// model. Anything else slotFor rejects is surfaced as an unknown, because
// tag-level drift never fails a test: an unrecognized renderer is simply
// never captured, so discovery has to happen here.
const ignoredTags = new Set([
  'yt-live-chat-placeholder-item-renderer',
  'yt-live-chat-mode-change-message-renderer',
]);

const captured = new Set<string>();
const pending = new Set<Slot>();
const unknownTags = new Set<string>();
let serverReachable = false;
let snapshotScheduled = false;
let snapshotSaved = false;

const badge = document.createElement('div');

badge.style.cssText = [
  'position: fixed',
  'left: 8px',
  'bottom: 8px',
  'z-index: 2147483647',
  'background: #222',
  'color: #fff',
  'font: 12px monospace',
  'padding: 6px 8px',
  'border-radius: 4px',
  'opacity: 0.85',
  'white-space: pre',
  'pointer-events: none',
].join('; ');

const render = (): void => {
  const missing = slots.filter((slot) => !captured.has(slot));

  badge.textContent = serverReachable
    ? `FYC capture ${captured.size}/${slots.length}${
      missing.length > 0
        ? `\nmissing: ${missing.join(', ')}`
        : ' — all captured'}${
      unknownTags.size > 0
        ? `\nunknown: ${[...unknownTags].join(', ')}`
        : ''}${
      snapshotSaved ? '\nsnapshot: saved' : ''}`
    : `FYC capture: server unreachable at ${serverBase}\nrun: pnpm capture-server`;
};

const reportUnknown = (tag: string): void => {
  if (ignoredTags.has(tag) || unknownTags.has(tag)) {
    return;
  }

  unknownTags.add(tag);
  render();
  GM.xmlHttpRequest({
    method: 'POST',
    url: `${serverBase}/unknown`,
    headers: {
      'Content-Type': 'application/json',
    },
    data: JSON.stringify({
      tag,
    }),
  });
};

const submit = (slot: Slot, element: HTMLElement): void => {
  pending.add(slot);
  GM.xmlHttpRequest({
    method: 'POST',
    url: `${serverBase}/capture`,
    headers: {
      'Content-Type': 'application/json',
    },
    data: JSON.stringify({
      slot,
      html: sanitize(slot, element),
    }),
    onload: (response) => {
      pending.delete(slot);

      if (response.status === 200) {
        serverReachable = true;
        captured.add(slot);
      }

      render();
    },
    onerror: () => {
      pending.delete(slot);
      serverReachable = false;
      render();
    },
  });
};

const refreshStatus = (): void => {
  GM.xmlHttpRequest({
    method: 'GET',
    url: `${serverBase}/status`,
    onload: (response) => {
      serverReachable = response.status === 200;
      const status = S.decodeUnknownOption(statusResponse)(
        response.responseText,
      );

      if (O.isSome(status)) {
        captured.clear();
        status.value.captured.forEach((slot) => captured.add(slot));
        unknownTags.clear();
        status.value.unknown.forEach((tag) => unknownTags.add(tag));
      }

      render();
    },
    onerror: () => {
      serverReachable = false;
      render();
    },
  });
};

const maybeCapture = (element: HTMLElement): void => {
  const slot = slotFor(element);

  if (O.isNone(slot)) {
    reportUnknown(element.tagName.toLowerCase());

    return;
  }

  if (!captured.has(slot.value) && !pending.has(slot.value)) {
    submit(slot.value, element);
  }
};

const observer = new MutationObserver((records) => {
  records.forEach((record) => {
    Array.from(record.addedNodes)
      .filter((node) => node.nodeType === Node.ELEMENT_NODE)
      // Chat nodes live in the iframe realm, so instanceof cannot narrow.
      // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
      .forEach((node) => maybeCapture(node as HTMLElement));
  });
});

let observedField: HTMLElement | undefined;
let observedTicker: HTMLElement | undefined;

// Unlike slot captures, the snapshot is RAW markup: real names, avatars and
// message text. The server writes it into the gitignored capture-snapshots/
// directory; it must never become a committed fixture as-is.
const takeSnapshot = (): void => {
  const app = observedField?.closest('yt-live-chat-app');

  if (!app) {
    return;
  }

  GM.xmlHttpRequest({
    method: 'POST',
    url: `${serverBase}/snapshot`,
    headers: {
      'Content-Type': 'application/json',
    },
    data: JSON.stringify({
      html: app.outerHTML,
    }),
    onload: (response) => {
      if (response.status === 200) {
        snapshotSaved = true;
        render();
      }
    },
  });
};

const attach = (): void => {
  const field = O.getOrUndefined(Z.runSync(Z.option(livePageYt.chatField)));
  const ticker = O.getOrUndefined(Z.runSync(Z.option(livePageYt.chatTicker)));

  if (field === observedField && ticker === observedTicker) {
    return;
  }

  observer.disconnect();
  observedField = field;
  observedTicker = ticker;

  // One raw snapshot per page load, delayed so the chat has populated.
  if (field && !snapshotScheduled) {
    snapshotScheduled = true;
    setTimeout(takeSnapshot, 30000);
  }

  [field, ticker].forEach((element) => {
    if (element) {
      observer.observe(element, {
        childList: true,
      });

      // Chat already on screen (notably persistent ticker items and the
      // engagement greeting) never mutates in, so scan it on attach.
      Array.from(element.children)
        // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
        .forEach((child) => maybeCapture(child as HTMLElement));
    }
  });
};

document.body.append(badge);
render();
refreshStatus();
attach();
setInterval(attach, 2000);
// Also heals "server unreachable" and notices a --refresh server restart.
setInterval(refreshStatus, 10000);
