import {
  Effect as Z,
  Option as O,
  Cause,
  pipe,
} from 'effect';

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
    O.getOrElse((): Document => document),
    (x) => Z.fromNullable(x.querySelector('yt-live-chat-app')),
  )),
);

export default ({
  toggleChatBtnParent: pipe(
    Z.sync(() => Array.from(
      document.querySelectorAll<HTMLElement>('.ytp-right-controls'),
    )),
    Z.flatMap((xs) => Z.fromNullable(
      xs.find((x) => x.offsetParent !== null),
    )),
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
    Z.flatMap(Z.fromNullable),
  ),
  player: pipe(
    Z.sync(() => document.querySelector('#movie_player')),
    Z.flatMap(Z.fromNullable),
  ),
  video: pipe(
    Z.sync(() => document.querySelector<HTMLVideoElement>(
      'video.video-stream.html5-main-video',
    )),
    Z.flatMap(Z.fromNullable),
  ),
  chatField: pipe(
    chatApp,
    Z.flatMap((app) => Z.fromNullable(
      app.querySelector<HTMLElement>('#items.yt-live-chat-item-list-renderer'),
    )),
  ),
  chatTicker: pipe(
    chatApp,
    Z.flatMap((app) => Z.fromNullable(
      // YouTube renamed the container from #items to #ticker-items; the old
      // form is kept while the rename may still be rolling out.
      app.querySelector<HTMLElement>(
        '#ticker-items.yt-live-chat-ticker-renderer,'
        + ' #items.yt-live-chat-ticker-renderer',
      ),
    )),
  ),
  chatScroller: pipe(
    chatApp,
    Z.flatMap((app) => Z.fromNullable(
      app.querySelector<HTMLElement>(
        '#item-scroller.yt-live-chat-item-list-renderer',
      ),
    )),
  ),
  offlineSlate: pipe(
    Z.sync(() => document.querySelector('.ytp-offline-slate')),
    Z.flatMap(Z.fromNullable),
  ),
}) satisfies LivePage;
