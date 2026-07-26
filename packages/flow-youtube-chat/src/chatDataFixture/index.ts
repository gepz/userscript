import {
  Option as O,
} from 'effect';

import ChatData from '@/ChatData';

// Test-only: the all-absent ChatData specs build their cases from, so a
// new field lands here instead of in a literal per spec. Nothing the
// bundle reaches imports it; the parseChat fixtures next door are the
// equivalent for real markup.
export default (overrides: Partial<ChatData> = {}): ChatData => ({
  chatType: 'normal',
  chatID: O.none(),
  authorType: 'normal',
  authorID: O.none(),
  authorName: O.none(),
  timestamp: O.none(),
  messageElement: O.none(),
  message: O.none(),
  messageText: O.none(),
  stickerUrl: O.none(),
  paymentInfo: O.none(),
  textColor: O.none(),
  paidColor: O.none(),
  ...overrides,
});
