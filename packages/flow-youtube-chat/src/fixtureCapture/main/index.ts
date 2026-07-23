import {
  Effect as Z,
  Option as O,
  Schema as S,
} from 'effect';

import {
  slots,
} from '@/fixtureCapture/Slot';
import {
  cooldownMs,
  maxSamples,
  port,
} from '@/fixtureCapture/protocol';
import sanitize from '@/fixtureCapture/sanitize';
import slotFor from '@/fixtureCapture/slotFor';
import livePageYt from '@/livePageYt';
import onElementSettled from '@/onElementSettled';

// Dev-only capture userscript entry (dist/capture, built by
// config/webpack.config.capture.ts, never shipped). Feeds live renderer
// markup to the ingest server (@/fixtureCapture/server); shared constants
// in @/fixtureCapture/protocol; the workflow is documented in
// src/parseChat/fixtures/README.md.

const serverBase = `http://localhost:${port}`;

// Every server response carries the per-kind sample counts, so any reply —
// status poll or capture, accepted or rejected — resyncs this client.
const kindsResponse = S.parseJson(S.Struct({
  kinds: S.Record({
    key: S.String,
    value: S.Number,
  }),
}));

// Renderer kinds known to exist that the fixtures deliberately do not
// model. Anything else slotFor rejects is captured as an unknown kind,
// because tag-level drift never fails a test: an unrecognized renderer is
// simply never captured, so discovery has to happen here.
const ignoredTags = new Set([
  'yt-live-chat-placeholder-item-renderer',
  'yt-live-chat-mode-change-message-renderer',
  // Ticker bubbles duplicate their chat-list entries, so the product does
  // not parse them (see @/allStream); the ticker stays observed only to
  // discover unlisted ticker renderers.
  'yt-live-chat-ticker-paid-message-item-renderer',
  'yt-live-chat-ticker-paid-sticker-item-renderer',
  'yt-live-chat-ticker-sponsor-item-renderer',
  // The per-recipient echo of a gift purchase; recognized by parseChat but
  // deliberately never flowed, so no fixture pins it.
  'ytd-sponsorships-live-chat-gift-redemption-announcement-renderer',
]);

const slotSet = new Set<string>(slots);

// Mirror of the server's per-kind sample counts. Nothing is captured or
// sent before the first successful sync, so a fresh page load cannot race
// ahead of what the server already holds.
const kinds = new Map<string, number>();
let synced = false;
let serverReachable = false;

const pending = new Set<string>();
const cooldownUntil = new Map<string, number>();
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

const countOf = (kind: string): number => kinds.get(kind) ?? 0;

const progress = (
  kind: string,
): string => `${kind} ${countOf(kind)}/${maxSamples}`;

const render = (): void => {
  const missing = slots.filter((slot) => countOf(slot) < maxSamples);
  const unknownKinds = [...kinds.keys()]
    .filter((kind) => !slotSet.has(kind));

  badge.textContent = serverReachable
    ? `FYC capture ${slots.length - missing.length}/${slots.length
    } slots full${
      missing.length > 0
        ? `\nsampling: ${missing.map(progress).join(', ')}`
        : ''}${
      unknownKinds.length > 0
        ? `\nunknown: ${unknownKinds.map(progress).join(', ')}`
        : ''}${
      snapshotSaved ? '\nsnapshot: saved' : ''}`
    : `FYC capture: server unreachable at ${serverBase}\nrun: pnpm capture-server`;
};

const syncKinds = (responseText: string): void => {
  const status = S.decodeUnknownOption(kindsResponse)(responseText);

  if (O.isSome(status)) {
    synced = true;
    kinds.clear();
    Object.entries(status.value.kinds).forEach(([kind, sampleCount]) => {
      kinds.set(kind, sampleCount);
    });
  }
};

// The insert-time serialization is only half the evidence (pre-hydration
// skeletons, moderation rewrites, lazy loads — see the fixtures README):
// each capture also reports the settled markup. A longer window than the
// product recheck, since samples are for offline analysis, not a chat
// still on screen.
const settleQuietMs = 1000;
const settleMaxMs = 10000;

const submit = (
  kind: string,
  payload: {
    raw: string
    sanitized: string | undefined
    settled: string | undefined
    detached: boolean
  },
): void => {
  GM.xmlHttpRequest({
    method: 'POST',
    url: `${serverBase}/capture`,
    headers: {
      'Content-Type': 'application/json',
    },
    // Raw markup becomes a local-only sample; sanitized (slot kinds only —
    // unknowns have no sanitizer) becomes the committed fixture; settled
    // rides along only when the element changed after insertion
    // (JSON.stringify drops the undefined fields).
    data: JSON.stringify({
      kind,
      raw: payload.raw,
      sanitized: payload.sanitized,
      settled: payload.settled,
      detached: payload.detached ? true : undefined,
    }),
    onload: (response) => {
      pending.delete(kind);
      serverReachable = true;
      syncKinds(response.responseText);
      render();
    },
    onerror: () => {
      pending.delete(kind);
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
      serverReachable = true;
      syncKinds(response.responseText);
      render();
    },
    onerror: () => {
      serverReachable = false;
      render();
    },
  });
};

const maybeCapture = (element: HTMLElement): void => {
  if (!synced) {
    return;
  }

  const slot = slotFor(element);
  const kind = O.isSome(slot) ? slot.value : element.tagName.toLowerCase();

  if ((O.isNone(slot) && ignoredTags.has(kind))
    || countOf(kind) >= maxSamples
    || pending.has(kind)
    || Date.now() < (cooldownUntil.get(kind) ?? 0)) {
    return;
  }

  // Reserved here rather than in submit: the kind stays pending across the
  // whole settle window, so a burst of same-kind inserts yields one sample.
  pending.add(kind);
  cooldownUntil.set(kind, Date.now() + cooldownMs);

  // The insert-time form is what parseChat sees in production, so it is
  // serialized (and sanitized) immediately; the settled form is compared
  // against it once the element stops changing.
  const raw = element.outerHTML;
  const sanitized = O.isSome(slot) ? sanitize(slot.value, element) : undefined;

  onElementSettled(element, settleQuietMs, settleMaxMs, () => {
    const settled = element.outerHTML;

    submit(kind, {
      raw,
      sanitized,
      settled: settled === raw ? undefined : settled,
      detached: !element.isConnected,
    });
  });
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
  // Before the first status sync nothing may be captured, so observing (or
  // scanning already-rendered chat) would only discard elements; the 2s
  // interval below re-attaches right after the sync lands.
  if (!synced) {
    return;
  }

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
