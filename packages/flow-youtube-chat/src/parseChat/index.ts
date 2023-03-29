import {
  pipe,
} from '@effect/data/Function';
import * as O from '@effect/data/Option';
import * as RA from '@effect/data/ReadonlyArray';
import {
  tapNonNull,
} from '@userscript/tap';

import ChatData from '@/ChatData';
import UserConfig from '@/UserConfig';

// チャット欄に追加されたチャットを抽出する
export default (
  chat: HTMLElement,
): (
  config: UserConfig,
  ) => ChatData => {
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

  const isPaid = chatType === 'ticker' || Boolean(
    chat.querySelector<HTMLElement>('#card'),
  );

  const paymentInfo = pipe(
    O.fromNullable(isPaid ? chat.querySelector<HTMLElement>(RA.join(', ')(
      [
        '#purchase-amount',
        '#purchase-amount-chip',
        '#content>#text',
      ],
    ))?.textContent : undefined),
    O.map((x) => ({
      visible: true,
      content: x,
    })),
  );

  const authorType = chat.querySelector('.owner') ? 'owner'
    : chat.querySelector('.moderator') ? 'moderator'
    : chat.querySelector('.member') ? 'member'
    : 'normal';

  const messageElement = O.fromNullable(
    chat.querySelector<HTMLElement>('#message'),
  );

  const isPaidNormal = O.isSome(paymentInfo) ? Boolean(chat.querySelector(
    '.yt-live-chat-paid-message-renderer',
  )) : false;

  const isPaidSticker = (O.isSome(paymentInfo) && !isPaidNormal) ? Boolean(
    chat.querySelector('.yt-live-chat-paid-sticker-renderer'),
  ) : false;

  const textColor = O.fromNullable(isPaidNormal ? window.getComputedStyle(
    tapNonNull(chat.querySelector('#header')),
  ).getPropertyValue('background-color')
    : isPaidSticker ? window.getComputedStyle(chat).getPropertyValue(
      '--yt-live-chat-paid-sticker-chip-background-color',
    ) : undefined);

  const paidColor = O.fromNullable(isPaidNormal ? window.getComputedStyle(
    tapNonNull(chat.querySelector('#content')),
  ).getPropertyValue('background-color')
    : isPaidSticker ? window.getComputedStyle(chat).getPropertyValue(
      '--yt-live-chat-paid-sticker-background-color',
    ) : undefined);

  const authorPhotoMatches = chat.querySelector<HTMLImageElement>(RA.join(' ')([
    '#author-photo',
    'img',
  ]))?.src.match(/ggpht\.com\/(ytc\/)?(.*)=/);

  const authorID = O.fromNullable(authorPhotoMatches?.at(-1));

  const authorName = O.fromNullable(
    chat.querySelector<HTMLElement>(
      '#author-name',
    )?.textContent,
  );

  const message = pipe(
    messageElement,
    O.map((x) => ({
      visible: true,
      content: x.innerHTML,
    })),
  );

  const messageText = pipe(
    messageElement,
    O.map((x) => ({
      visible: true,
      content: x.textContent ?? '',
    })),
  );

  return (config) => ({
    chatType,
    authorType,
    authorID,
    authorName: pipe(
      authorName,
      O.map((x) => ({
        visible: (
          authorType === 'moderator'
      && config.displayModName
        ) || (
          O.isSome(paymentInfo)
      && config.displaySuperChatAuthor
        ),
        content: x,
      })),
    ),
    messageElement,
    message,
    messageText,
    paymentInfo,
    textColor,
    paidColor,
  });
};
