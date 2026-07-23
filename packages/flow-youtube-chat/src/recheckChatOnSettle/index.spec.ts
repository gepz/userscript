// @vitest-environment happy-dom
import {
  Option as O,
} from 'effect';
import {
  describe,
  expect,
  it,
} from 'vitest';

import ChatData from '@/ChatData';
import {
  parseRelevantChanged,
} from '@/recheckChatOnSettle';

const chatData = (overrides: Partial<ChatData>): ChatData => ({
  chatType: 'normal',
  chatID: O.some('FixtureChatID'),
  authorType: 'normal',
  authorID: O.none(),
  authorName: O.none(),
  timestamp: O.some('1:23 PM'),
  messageElement: O.none(),
  message: O.none(),
  messageText: O.some('hello'),
  paymentInfo: O.none(),
  textColor: O.none(),
  paidColor: O.none(),
  ...overrides,
});

describe('parseRelevantChanged', () => {
  it('is false for an unchanged parse', () => {
    expect(parseRelevantChanged(chatData({}), chatData({}))).toBe(false);
  });

  it('detects a late-stamped author identity', () => {
    expect(parseRelevantChanged(
      chatData({}),
      chatData({
        authorName: O.some('@someone'),
      }),
    )).toBe(true);

    expect(parseRelevantChanged(
      chatData({}),
      chatData({
        authorID: O.some('Token123'),
      }),
    )).toBe(true);

    expect(parseRelevantChanged(
      chatData({}),
      chatData({
        authorType: 'member',
      }),
    )).toBe(true);
  });

  it('detects a rewritten message text', () => {
    expect(parseRelevantChanged(
      chatData({}),
      chatData({
        messageText: O.none(),
      }),
    )).toBe(true);
  });

  it('detects a late-settling chat type or payment styling', () => {
    expect(parseRelevantChanged(
      chatData({}),
      chatData({
        chatType: 'giftPurchase',
      }),
    )).toBe(true);

    expect(parseRelevantChanged(
      chatData({}),
      chatData({
        paymentInfo: O.some('$5.00'),
        paidColor: O.some('rgb(0, 191, 165)'),
      }),
    )).toBe(true);
  });

  it('ignores the live message fields', () => {
    const before = chatData({});
    const element = document.createElement('div');

    // message innerHTML and the element reference change on every emoji
    // lazy-load; they must not trigger a recheck.
    expect(parseRelevantChanged(before, chatData({
      message: O.some('<img src="other">'),
      messageElement: O.some(element),
    }))).toBe(false);
  });
});
