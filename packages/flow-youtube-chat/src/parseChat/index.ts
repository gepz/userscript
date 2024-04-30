import {
  Array as A,
  Option as O,
  Predicate as P,
} from 'effect';
import {
  pipe,
} from 'effect/Function';

import ChatData from '@/ChatData';

export default (
  chat: HTMLElement,
): ChatData => {
  const chatType = chat.querySelector<HTMLElement>(
    '.yt-live-chat-ticker-paid-message-item-renderer',
  ) ? 'ticker'
    : chat.querySelector<HTMLElement>(
      '.yt-live-chat-membership-item-renderer',
    ) ? 'membership'
    : chat.querySelector<HTMLElement>(
      '.yt-live-chat-viewer-engagement-message-renderer',
    ) ? 'engagement'
    : 'normal';

  const paymentInfo = pipe(
    chatType === 'ticker' || chat.querySelector<HTMLElement>('#card') !== null,
    (isPaid) => O.fromNullable(
      isPaid ? chat.querySelector<HTMLElement>(A.join(', ')(
        [
          '#purchase-amount',
          '#purchase-amount-chip',
          '#content>#text',
        ],
      ))?.textContent : undefined,
    ),
  );

  const messageElement = O.fromNullable(
    chat.querySelector<HTMLElement>('#message'),
  );

  const isPaidNormal = O.isSome(paymentInfo) && P.isTruthy(chat.querySelector(
    '.yt-live-chat-paid-message-renderer',
  ));

  const isPaidSticker = O.isSome(paymentInfo) && !isPaidNormal && P.isTruthy(
    chat.querySelector('.yt-live-chat-paid-sticker-renderer'),
  );

  const visibleBackgroundColor = (element: Element) => pipe(
    window.getComputedStyle(
      element,
    ).getPropertyValue('background-color'),
    O.liftPredicate((x) => x !== 'transparent'
    && x !== 'rgba(0, 0, 0, 0)'),
  );

  return {
    chatType,
    authorType: chat.querySelector('.owner') ? 'owner'
    : chat.querySelector('.moderator') ? 'moderator'
    : chat.querySelector('.member') ? 'member'
    : 'normal',
    authorID: pipe(
      chat.querySelector<HTMLImageElement>(A.join(' ')([
        '#author-photo',
        'img',
      ]))?.src.match(/ggpht\.com\/(ytc\/)?(.*)=/),
      (authorPhotoMatches) => O.fromNullable(authorPhotoMatches?.at(-1)),
    ),
    authorName: O.fromNullable(
      chat.querySelector<HTMLElement>(
        '#author-name',
      )?.textContent,
    ),
    timestamp: O.fromNullable(chat.querySelector('#timestamp')?.textContent),
    messageElement,
    message: pipe(
      messageElement,
      O.map((x) => x.innerHTML),
    ),
    messageText: pipe(
      messageElement,
      O.map((x) => x.textContent ?? ''),
    ),
    paymentInfo,
    textColor: isPaidNormal ? pipe(
      O.fromNullable(chat.querySelector('#header')),
      O.flatMap(visibleBackgroundColor),
      O.orElse(() => pipe(
        O.fromNullable(chat.querySelector('#card')),
        O.flatMap(visibleBackgroundColor),
      )),
      O.orElse(() => pipe(
        O.fromNullable(chat.querySelector('#content')),
        O.flatMap(visibleBackgroundColor),
      )),
    ) : isPaidSticker ? O.some(window.getComputedStyle(chat).getPropertyValue(
      '--yt-live-chat-paid-sticker-chip-background-color',
    )) : O.none(),
    paidColor: isPaidNormal ? pipe(
      O.fromNullable(chat.querySelector('#content')),
      O.flatMap(visibleBackgroundColor),
      O.orElse(() => pipe(
        O.fromNullable(chat.querySelector('#card')),
        O.flatMap(visibleBackgroundColor),
      )),
      O.orElse(() => pipe(
        O.fromNullable(chat.querySelector('#header')),
        O.flatMap(visibleBackgroundColor),
      )),
    ) : isPaidSticker ? O.some(window.getComputedStyle(chat).getPropertyValue(
      '--yt-live-chat-paid-sticker-background-color',
    )) : O.none(),
  };
};
