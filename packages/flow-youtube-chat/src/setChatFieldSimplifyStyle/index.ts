import * as IO from 'fp-ts/IO';
import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import {
  pipe,
} from 'fp-ts/function';

export default (
  chat: HTMLElement,
): IO.IO<void> => (chat.querySelector(
  '.style-scope.yt-live-chat-paid-message-renderer',
) ? () => {}
: pipe(
  [
    '#author-photo',
    'yt-live-chat-author-chip.style-scope.yt-live-chat-text-message-renderer',
  ],
  RA.map((x) => O.fromNullable(chat.querySelector<HTMLElement>(x))),
  RA.compact,
  RA.map((x) => () => {
    // eslint-disable-next-line no-param-reassign
    x.style.display = 'none';
  }),
  RA.append(() => {
    // eslint-disable-next-line no-param-reassign
    chat.style.borderBottom = '1px solid var(--yt-spec-text-secondary)';
  }),
  IO.sequenceArray,
));
