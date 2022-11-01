import * as O from 'fp-ts/Option';
import {
  pipe,
} from 'fp-ts/function';

import LivePage from '@/LivePage';

const chatApp = (): O.Option<Element> => pipe(
  O.fromNullable(
    document.querySelector<HTMLIFrameElement>('#chatframe'),
  ),
  O.filter((x) => {
    const state = x.contentDocument?.readyState;
    return state === 'loading' || state === 'complete';
  }),
  O.chainNullableK((x) => x.contentDocument),
  O.alt(() => O.some(document)),
  O.chainNullableK((x) => x.querySelector(
    'yt-live-chat-app',
  )),
);

export default (): LivePage => ({
  toggleChatBtnParent: () => O.fromNullable(
    document.querySelector('.ytp-right-controls'),
  ),
  settingsToggleNextElement: () => pipe(
    document.querySelector<HTMLElement>('#menu-container'),
    O.fromNullable,
    O.filter((x) => x.offsetParent !== null),
    O.chainNullableK((x) => x.querySelector(
      '.dropdown-trigger.ytd-menu-renderer',
    )),
    O.alt(() => O.fromNullable(document.querySelector(
      '#top-row .dropdown-trigger.ytd-menu-renderer',
    ))),
  ),
  settingsContainer: () => O.fromNullable(document.body),
  player: () => O.fromNullable(document.querySelector('#movie_player')),
  video: () => O.fromNullable(document.querySelector<HTMLVideoElement>(
    'video.video-stream.html5-main-video',
  )),
  chatField: () => pipe(
    chatApp(),
    O.chainNullableK((x) => x.querySelector<HTMLElement>(
      '#items.yt-live-chat-item-list-renderer',
    )),
  ),
  chatTicker: () => pipe(
    chatApp(),
    O.chainNullableK((x) => x.querySelector<HTMLElement>(
      '#items.yt-live-chat-ticker-renderer',
    )),
  ),
  chatScroller: () => pipe(
    chatApp(),
    O.chainNullableK((x) => x.querySelector<HTMLElement>(
      '#item-scroller.yt-live-chat-item-list-renderer',
    )),
  ),
  offlineSlate: () => O.fromNullable(
    document.querySelector(
      '.ytp-offline-slate',
    ),
  ),
});
