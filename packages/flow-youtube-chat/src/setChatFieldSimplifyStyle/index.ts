import {
  Array as A,
  Effect as Z,
  Option as O,
  pipe,
} from 'effect';

export default (
  chat: HTMLElement,
// eslint-disable-next-line func-names
): Z.Effect<void> => Z.gen(function* () {
  if (!chat.querySelector(
    '.style-scope.yt-live-chat-paid-message-renderer',
  )) {
    yield* pipe(
      [
        '#author-photo',
        // eslint-disable-next-line max-len
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
    );
  }
});
