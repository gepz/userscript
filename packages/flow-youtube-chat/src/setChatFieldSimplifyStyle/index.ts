import * as Z from 'effect/Effect';
import {
  pipe,
} from 'effect/Function';
import * as O from 'effect/Option';
import * as RA from 'effect/ReadonlyArray';

export default (
  chat: HTMLElement,
): Z.Effect<never, never, void> => (chat.querySelector(
  '.style-scope.yt-live-chat-paid-message-renderer',
) ? Z.unit
: pipe(
  [
    '#author-photo',
    'yt-live-chat-author-chip.style-scope.yt-live-chat-text-message-renderer',
  ],
  RA.map((x) => O.fromNullable(chat.querySelector<HTMLElement>(x))),
  RA.getSomes,
  RA.map((x) => Z.sync(() => {
    // eslint-disable-next-line no-param-reassign
    x.style.display = 'none';
  })),
  RA.append(Z.sync(() => {
    // eslint-disable-next-line no-param-reassign
    chat.style.borderBottom = '1px solid var(--yt-spec-text-secondary)';
  })),
  Z.all,
));
