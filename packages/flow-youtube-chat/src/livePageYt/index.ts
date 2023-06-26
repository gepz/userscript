import {
  pipe,
  flow,
} from '@effect/data/Function';
import * as O from '@effect/data/Option';
import * as Cause from '@effect/io/Cause';
import * as Z from '@effect/io/Effect';

import LivePage from '@/LivePage';

const chatApp: Z.Effect<never, Cause.NoSuchElementException, Element> = pipe(
  Z.sync(() => document.querySelector<HTMLIFrameElement>('#chatframe')),
  Z.flatMap(flow(
    O.fromNullable,
    O.filter(flow(
      (x: HTMLIFrameElement) => x.contentDocument?.readyState,
      (x) => x === 'loading' || x === 'complete',
    )),
    O.flatMapNullable((x) => x.contentDocument),
    O.orElse(() => O.some(document)),
    O.flatMapNullable((x) => x.querySelector('yt-live-chat-app')),
  )),
);

export default ({
  toggleChatBtnParent: pipe(
    Z.sync(() => document.querySelector('.ytp-right-controls')),
    Z.flatMap(O.fromNullable),
  ),
  settingsToggleNextElement: pipe(
    Z.sync(() => document.querySelector<HTMLElement>('#menu-container')),
    Z.flatMap(flow(
      O.fromNullable,
      O.filter((x) => x.offsetParent !== null),
      O.flatMapNullable((x) => x.querySelector(
        '.dropdown-trigger.ytd-menu-renderer',
      )),
      O.orElse(() => O.fromNullable(document.querySelector(
        '#top-row .dropdown-trigger.ytd-menu-renderer',
      ))),
    )),
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
    Z.flatMap(flow(
      (x) => x.querySelector<HTMLElement>(
        '#items.yt-live-chat-item-list-renderer',
      ),
      O.fromNullable,
    )),
  ),
  chatTicker: pipe(
    chatApp,
    Z.flatMap(flow(
      (x) => x.querySelector<HTMLElement>(
        '#items.yt-live-chat-ticker-renderer',
      ),
      O.fromNullable,
    )),
  ),
  chatScroller: pipe(
    chatApp,
    Z.flatMap(flow(
      (x) => x.querySelector<HTMLElement>(
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
