import {
  Option as O,
} from 'effect';

import Slot from '@/fixtureCapture/Slot';
import parseChat from '@/parseChat';

const byAuthorType = {
  owner: 'ownerMessage',
  moderator: 'moderatorMessage',
  member: 'memberMessage',
  normal: 'normalMessage',
} as const;

const byTag: Record<string, Slot | undefined> = {
  'yt-live-chat-paid-message-renderer': 'paidMessage',
  'yt-live-chat-paid-sticker-renderer': 'paidSticker',
  'yt-live-chat-membership-item-renderer': 'membershipItem',
  'yt-live-chat-ticker-paid-message-item-renderer': 'tickerPaidMessage',
  'yt-live-chat-viewer-engagement-message-renderer': 'engagementMessage',
};

/**
 * Which fixture slot a live chat element refreshes; none for renderer kinds
 * the fixtures do not model (placeholders, banners, sponsor tickers, ...).
 * Text messages split by author type through parseChat itself so this
 * mapping cannot drift from the parser's precedence rules.
 */
export default (chat: HTMLElement): O.Option<Slot> => {
  const tag = chat.tagName.toLowerCase();

  return tag === 'yt-live-chat-text-message-renderer'
    ? O.some(byAuthorType[parseChat(chat).authorType])
    : O.fromNullable(byTag[tag]);
};
