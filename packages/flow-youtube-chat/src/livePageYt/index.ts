import {
  Effect as Z,
  Option as O,
  Array as A,
  Cause,
} from 'effect';
import {
  pipe,
} from 'effect/Function';

import LivePage from '@/LivePage';

const chatApp: Z.Effect<Element, Cause.NoSuchElementException> = pipe(
  Z.sync(() => document.querySelector<HTMLIFrameElement>('#chatframe')),
  Z.flatMap((nullableFrame) => pipe(
    O.fromNullable(nullableFrame),
    O.filter((frame) => pipe(
      frame.contentDocument?.readyState,
      (x) => x === 'loading' || x === 'complete',
    )),
    O.flatMapNullable((x) => x.contentDocument),
    O.orElse(() => O.some(document)),
    O.flatMapNullable((x) => x.querySelector('yt-live-chat-app')),
  )),
);

export default ({
  toggleChatBtnParent: pipe(
    Z.sync(() => Array.from(
      document.querySelectorAll<HTMLElement>('.ytp-right-controls'),
    )),
    Z.flatMap(A.findFirst((x) => x.offsetParent !== null)),
  ),
  settingsToggleNextElement: pipe(
    Z.sync(() => document.querySelector<HTMLElement>('#menu-container')),
    Z.flatMap(Z.fromNullable),
    Z.filterOrFail((x) => x.offsetParent !== null),
    Z.flatMap((x) => Z.fromNullable(x.querySelector<HTMLElement>(
      '.dropdown-trigger.ytd-menu-renderer',
    ))),
    Z.orElse(() => Z.fromNullable(document.querySelector<HTMLElement>(
      '#top-row .dropdown-trigger.ytd-menu-renderer',
    ))),
    Z.filterOrFail((x) => x.parentElement?.offsetParent !== null),
  ),
  settingsContainer: pipe(
    Z.sync(() => document.body),
    Z.flatMap(O.fromNullable),
  ),
  player: pipe(
    Z.sync(() => document.querySelector('#movie_player')),
    Z.flatMap(O.fromNullable),
  ),
  video: pipe(
    Z.sync(() => document.querySelector<HTMLVideoElement>(
      'video.video-stream.html5-main-video',
    )),
    Z.flatMap(O.fromNullable),
  ),
  chatField: pipe(
    chatApp,
    Z.flatMap((app) => pipe(
      app.querySelector<HTMLElement>('#items.yt-live-chat-item-list-renderer'),
      O.fromNullable,
    )),
  ),
  chatTicker: pipe(
    chatApp,
    Z.flatMap((app) => pipe(
      app.querySelector<HTMLElement>('#items.yt-live-chat-ticker-renderer'),
      O.fromNullable,
    )),
  ),
  chatScroller: pipe(
    chatApp,
    Z.flatMap((app) => pipe(
      app.querySelector<HTMLElement>(
        '#item-scroller.yt-live-chat-item-list-renderer',
      ),
      O.fromNullable,
    )),
  ),
  offlineSlate: pipe(
    Z.sync(() => document.querySelector('.ytp-offline-slate')),
    Z.flatMap(O.fromNullable),
  ),
}) satisfies LivePage;
