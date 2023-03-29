import {
  pipe,
  flow,
} from '@effect/data/Function';
import * as O from '@effect/data/Option';
import * as Z from '@effect/io/Effect';

import LivePage from '@/LivePage';
import flatMapOption from '@/flatMapOption';

const chatApp: Z.Effect<never, O.Option<never>, Element> = pipe(
  Z.sync(() => document.querySelector<HTMLIFrameElement>('#chatframe')),
  Z.map(flow(
    O.fromNullable,
    O.filter(flow(
      (x: HTMLIFrameElement) => x.contentDocument?.readyState,
      (x) => x === 'loading' || x === 'complete',
    )),
    O.flatMapNullable((x) => x.contentDocument),
    O.orElse(() => O.some(document)),
    O.flatMapNullable((x) => x.querySelector(
      'yt-live-chat-app',
    )),
  )),
  Z.some,
);

export default ({
  toggleChatBtnParent: pipe(
    Z.sync(() => document.querySelector('.ytp-right-controls')),
    Z.map(O.fromNullable),
    Z.some,
  ),
  settingsToggleNextElement: pipe(
    Z.sync(() => document.querySelector<HTMLElement>('#menu-container')),
    Z.map(flow(
      O.fromNullable,
      O.filter((x) => x.offsetParent !== null),
      O.flatMapNullable((x) => x.querySelector(
        '.dropdown-trigger.ytd-menu-renderer',
      )),
      O.orElse(() => O.fromNullable(document.querySelector(
        '#top-row .dropdown-trigger.ytd-menu-renderer',
      ))),
    )),
    Z.some,
  ),
  settingsContainer: pipe(
    Z.sync(() => document.body),
    Z.map(O.fromNullable),
    Z.some,
  ),
  player: pipe(
    Z.sync(() => document.querySelector('#movie_player')),
    Z.map(O.fromNullable),
    Z.some,
  ),
  video: pipe(
    Z.sync(() => document.querySelector<HTMLVideoElement>(
      'video.video-stream.html5-main-video',
    )),
    Z.map(O.fromNullable),
    Z.some,
  ),
  chatField: pipe(
    chatApp,
    flatMapOption(flow(
      (x) => x.querySelector<HTMLElement>(
        '#items.yt-live-chat-item-list-renderer',
      ),
      O.fromNullable,
    )),
  ),
  chatTicker: pipe(
    chatApp,
    flatMapOption(flow(
      (x) => x.querySelector<HTMLElement>(
        '#items.yt-live-chat-ticker-renderer',
      ),
      O.fromNullable,
    )),
  ),
  chatScroller: pipe(
    chatApp,
    flatMapOption(flow(
      (x) => x.querySelector<HTMLElement>(
        '#item-scroller.yt-live-chat-item-list-renderer',
      ),
      O.fromNullable,
    )),
  ),
  offlineSlate: pipe(
    Z.sync(() => document.querySelector(
      '.ytp-offline-slate',
    )),
    Z.map(O.fromNullable),
    Z.some,
  ),
}) satisfies LivePage;
