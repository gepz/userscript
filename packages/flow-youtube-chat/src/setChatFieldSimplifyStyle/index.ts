import {
  Array as A,
  Effect as Z,
  Option as O,
  pipe,
} from 'effect';

export default (
  chat: HTMLElement,
): Z.Effect<void> => (chat.querySelector(
  '.style-scope.yt-live-chat-paid-message-renderer',
) ? Z.void
: pipe(
  [
    '#author-photo',
    'yt-live-chat-author-chip.style-scope.yt-live-chat-text-message-renderer',
  ],
  A.map((x) => O.fromNullable(chat.querySelector<HTMLElement>(x))),
  A.getSomes,
  A.map((x) => Z.sync(() => {
    // eslint-disable-next-line no-param-reassign
    x.style.display = 'none';
  })),
  A.append(Z.sync(() => {
    // eslint-disable-next-line no-param-reassign
    chat.style.borderBottom = '1px solid var(--yt-spec-text-secondary)';
  })),
  Z.all,
));
