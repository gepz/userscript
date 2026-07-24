import {
  Option as O,
} from 'effect';
import {
  describe,
  expect,
  it,
} from 'vitest';

import ChatData from '@/ChatData';
import isRepeatedText from '@/isRepeatedText';

const chatData = (overrides: Partial<ChatData>): ChatData => ({
  chatType: 'normal',
  chatID: O.none(),
  authorType: 'normal',
  authorID: O.none(),
  authorName: O.none(),
  timestamp: O.none(),
  messageElement: O.none(),
  message: O.none(),
  messageText: O.none(),
  paymentInfo: O.none(),
  textColor: O.none(),
  paidColor: O.none(),
  ...overrides,
});

describe('isRepeatedText', () => {
  it('matches equal message texts from different messages', () => {
    expect(isRepeatedText(
      chatData({
        chatID: O.some('msg-2'),
        authorID: O.some('author-b'),
        messageText: O.some('草'),
      }),
      chatData({
        chatID: O.some('msg-1'),
        authorID: O.some('author-a'),
        messageText: O.some('草'),
      }),
    )).toBe(true);
  });

  it('ignores surrounding whitespace', () => {
    expect(isRepeatedText(
      chatData({
        messageText: O.some(' 草 '),
      }),
      chatData({
        messageText: O.some('草'),
      }),
    )).toBe(true);
  });

  it('distinguishes different texts', () => {
    expect(isRepeatedText(
      chatData({
        messageText: O.some('草'),
      }),
      chatData({
        messageText: O.some('ww'),
      }),
    )).toBe(false);
  });

  it('never matches blank texts against each other', () => {
    expect(isRepeatedText(
      chatData({
        messageText: O.some('  '),
      }),
      chatData({
        messageText: O.some('  '),
      }),
    )).toBe(false);
  });

  it('never matches absent texts against each other', () => {
    expect(isRepeatedText(
      chatData({}),
      chatData({}),
    )).toBe(false);
  });

  it('never counts a paid candidate as a repeat', () => {
    expect(isRepeatedText(
      chatData({
        messageText: O.some('Thanks!'),
        paymentInfo: O.some('$5.00'),
      }),
      chatData({
        messageText: O.some('Thanks!'),
      }),
    )).toBe(false);
  });

  it('counts a free candidate repeating a paid chat', () => {
    expect(isRepeatedText(
      chatData({
        messageText: O.some('Thanks!'),
      }),
      chatData({
        messageText: O.some('Thanks!'),
        paymentInfo: O.some('$5.00'),
      }),
    )).toBe(true);
  });
});
