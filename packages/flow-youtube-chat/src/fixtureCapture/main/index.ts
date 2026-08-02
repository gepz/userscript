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
// config/webpack.config.capture.mts, never shipped). Feeds live renderer
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
    url: string
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
      url: payload.url,
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
  // Read now, not at submit: the settle window is long enough for an SPA
  // navigation to move location off the stream this chat belongs to.
  const url = window.location.href;

  onElementSettled(element, settleQuietMs, settleMaxMs, () => {
    const settled = element.outerHTML;

    submit(kind, {
      raw,
      sanitized,
      settled: settled === raw ? undefined : settled,
      detached: !element.isConnected,
      url,
    });
  });
};

let observedField: HTMLElement | undefined;
let observedTicker: HTMLElement | undefined;

// Geometry sampling: evidence for the product's isAboveVisibleTail
// verdicts. Each chat-list insert batch reports the scroller's scroll
// metrics and every added chat's box at insert, the next frame, and a few
// later instants, so seek-repopulation flooding can be diagnosed from
// real numbers instead of assumptions about when the list restores its
// scroll. Submitted to the server's generic /trace event channel as kind
// 'geometry'.
const geometryLaterMs = [120, 400, 1200];
const geometrySubmitMs = 1300;

interface GeometrySample {
  at: number
  scroller: {
    top: number
    bottom: number
    scrollTop: number
    scrollHeight: number
    clientHeight: number
  } | null
  chats: {
    tag: string
    id: string | null
    top: number
    bottom: number
    connected: boolean
  }[]
}

const measureBatch = (
  added: readonly HTMLElement[],
  start: number,
): GeometrySample => {
  const scroller = added.find((chat) => chat.isConnected)
    ?.closest('#item-scroller') ?? null;

  const scrollerBox = scroller?.getBoundingClientRect();

  return {
    at: Math.round(performance.now() - start),
    scroller: scroller === null || scrollerBox === undefined
      ? null
      : {
        top: Math.round(scrollerBox.top),
        bottom: Math.round(scrollerBox.bottom),
        scrollTop: Math.round(scroller.scrollTop),
        scrollHeight: scroller.scrollHeight,
        clientHeight: scroller.clientHeight,
      },
    chats: added.map((chat) => {
      const box = chat.getBoundingClientRect();

      return {
        tag: chat.tagName.toLowerCase(),
        // The renderer id is the message id: real data, but the trace lives
        // in the local-only capture-snapshots directory like every raw
        // sample, and the id is what correlates a trace row with a flow.
        id: chat.id === '' ? null : chat.id,
        top: Math.round(box.top),
        bottom: Math.round(box.bottom),
        connected: chat.isConnected,
      };
    }),
  };
};

const recordBatchGeometry = (added: readonly HTMLElement[]): void => {
  if (added.length === 0) {
    return;
  }

  const start = performance.now();
  const url = window.location.href;
  const samples: GeometrySample[] = [measureBatch(added, start)];

  requestAnimationFrame(() => {
    samples.push(measureBatch(added, start));
  });

  geometryLaterMs.forEach((ms) => {
    setTimeout(() => {
      samples.push(measureBatch(added, start));
    }, ms);
  });

  // Fire-and-forget: the trace is diagnostics, not sampling state, so it
  // touches neither the badge nor the kind counts.
  setTimeout(() => {
    GM.xmlHttpRequest({
      method: 'POST',
      url: `${serverBase}/trace`,
      headers: {
        'Content-Type': 'application/json',
      },
      data: JSON.stringify({
        kind: 'geometry',
        batchSize: added.length,
        samples,
        url,
      }),
    });
  }, geometrySubmitMs);
};

// Flow evictions (kind 'flowEviction' on the /trace channel): evidence
// for the backlog's max-chat-amount premature-removal bug. The product
// takes a flowing chat off screen early in exactly two ways —
// @/addFlowChat cancels a recycled span's animation, @/removeOldChats
// detaches the span mid-flight — so both surface black-box on the
// product's .fyc_chat spans (top document, not the chat iframe) as an
// animation canceled, or an element disconnected, at fractional
// progress. Natural finishes never report. liveCount is the on-screen
// span count at the eviction, to compare against the configured max:
// evictions while visibly below it are the bug's signature.
const flowSweepMs = 250;

interface WatchedFlow {
  span: HTMLElement
  animation: Animation
  durationMs: number
  // currentTime survives sampling but is nulled by cancel, so the sweep
  // keeps the last reading for the cancel report to use.
  lastTimeMs: number
}

const watchedFlows = new Map<Animation, WatchedFlow>();

const reportFlowEviction = (
  watched: WatchedFlow,
  reason: 'canceled' | 'detached',
  progressMs: number,
): void => {
  const flightProgress = watched.durationMs > 0
    ? progressMs / watched.durationMs
    : 1;

  // A finished chat's span is legitimately recycled or cleaned up; only a
  // chat that still had flight time left was evicted early.
  if (flightProgress >= 1) {
    return;
  }

  GM.xmlHttpRequest({
    method: 'POST',
    url: `${serverBase}/trace`,
    headers: {
      'Content-Type': 'application/json',
    },
    data: JSON.stringify({
      kind: 'flowEviction',
      reason,
      progress: Math.round(flightProgress * 100) / 100,
      elapsedMs: Math.round(progressMs),
      durationMs: Math.round(watched.durationMs),
      playState: watched.animation.playState,
      liveCount: document.querySelectorAll('.fyc_chat').length,
      // Real message text, matching what was visibly cut short; fine in
      // the local-only trace, never in anything committed.
      text: watched.span.textContent?.slice(0, 40) ?? '',
      url: window.location.href,
    }),
  });
};

const sweepFlowEvictions = (): void => {
  document.querySelectorAll<HTMLElement>('.fyc_chat').forEach((span) => {
    // One entry per Animation, not per span: a recycled span gets a fresh
    // animation, which must be tracked as a new flight.
    const animation = span.getAnimations()[0];

    if (animation && !watchedFlows.has(animation)) {
      const watched: WatchedFlow = {
        span,
        animation,
        durationMs: Number(animation.effect?.getTiming().duration ?? 0),
        lastTimeMs: Number(animation.currentTime ?? 0),
      };

      watchedFlows.set(animation, watched);

      animation.addEventListener('cancel', () => {
        if (watchedFlows.delete(animation)) {
          reportFlowEviction(watched, 'canceled', watched.lastTimeMs);
        }
      });

      animation.addEventListener('finish', () => {
        watchedFlows.delete(animation);
      });
    }
  });

  watchedFlows.forEach((watched, animation) => {
    if (!watched.span.isConnected && animation.playState !== 'finished') {
      watchedFlows.delete(animation);
      reportFlowEviction(
        watched,
        'detached',
        Number(animation.currentTime ?? watched.lastTimeMs),
      );
    } else {
      watched.lastTimeMs = Number(
        animation.currentTime ?? watched.lastTimeMs,
      );
    }
  });
};

const observer = new MutationObserver((records) => {
  recordBatchGeometry(records
    .filter((record) => record.target === observedField)
    .flatMap((record) => Array.from(record.addedNodes))
    // Chat nodes live in the iframe realm, so instanceof cannot narrow.
    .filter((node): node is HTMLElement => (
      node.nodeType === Node.ELEMENT_NODE
    )));

  records.forEach((record) => {
    Array.from(record.addedNodes)
      .filter((node): node is HTMLElement => (
        node.nodeType === Node.ELEMENT_NODE
      ))
      .forEach((node) => maybeCapture(node));
  });
});

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
      url: window.location.href,
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
// Fast enough that a chat evicted moments after starting is still seen
// with a sampled animation before it goes.
setInterval(sweepFlowEvictions, flowSweepMs);
