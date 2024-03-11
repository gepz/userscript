import tapNonNull from '@userscript/tap-non-null';
import {
  pipe,
} from 'effect/Function';
import * as O from 'effect/Option';
import * as RA from 'effect/ReadonlyArray';

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
      isPaid ? chat.querySelector<HTMLElement>(RA.join(', ')(
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

  const isPaidNormal = O.isSome(paymentInfo) ? Boolean(chat.querySelector(
    '.yt-live-chat-paid-message-renderer',
  )) : false;

  const isPaidSticker = (O.isSome(paymentInfo) && !isPaidNormal) ? Boolean(
    chat.querySelector('.yt-live-chat-paid-sticker-renderer'),
  ) : false;

  return {
    chatType,
    authorType: chat.querySelector('.owner') ? 'owner'
    : chat.querySelector('.moderator') ? 'moderator'
    : chat.querySelector('.member') ? 'member'
    : 'normal',
    authorID: pipe(
      chat.querySelector<HTMLImageElement>(RA.join(' ')([
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
    textColor: O.fromNullable(isPaidNormal ? window.getComputedStyle(
      tapNonNull(chat.querySelector('#header')),
    ).getPropertyValue('background-color')
    : isPaidSticker ? window.getComputedStyle(chat).getPropertyValue(
      '--yt-live-chat-paid-sticker-chip-background-color',
    ) : undefined),
    paidColor: O.fromNullable(isPaidNormal ? window.getComputedStyle(
      tapNonNull(chat.querySelector('#content')),
    ).getPropertyValue('background-color')
    : isPaidSticker ? window.getComputedStyle(chat).getPropertyValue(
      '--yt-live-chat-paid-sticker-background-color',
    ) : undefined),
  };
};
