import {
  pipe,
} from '@effect/data/Function';
import * as O from '@effect/data/Option';
import * as RA from '@effect/data/ReadonlyArray';
import * as Z from '@effect/io/Effect';

export default (
  chat: HTMLElement,
): Z.Effect<never, never, void> => (chat.querySelector(
  '.style-scope.yt-live-chat-paid-message-renderer',
) ? Z.unit()
: pipe(
  [
    '#author-photo',
    'yt-live-chat-author-chip.style-scope.yt-live-chat-text-message-renderer',
  ],
  RA.map((x) => O.fromNullable(chat.querySelector<HTMLElement>(x))),
  RA.compact,
  RA.map((x) => Z.sync(() => {
    // eslint-disable-next-line no-param-reassign
    x.style.display = 'none';
  })),
  RA.append(Z.sync(() => {
    // eslint-disable-next-line no-param-reassign
    chat.style.borderBottom = '1px solid var(--yt-spec-text-secondary)';
  })),
  (x) => Z.all(x),
));
