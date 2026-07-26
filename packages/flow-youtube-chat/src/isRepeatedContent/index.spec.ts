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
import isRepeatedContent from '@/isRepeatedContent';

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
  stickerUrl: O.none(),
  paymentInfo: O.none(),
  textColor: O.none(),
  paidColor: O.none(),
  ...overrides,
});

const emoji = (id: string): HTMLImageElement => {
  const img = document.createElement('img');
  img.className = 'emoji';
  img.alt = 'きちゃ';
  img.setAttribute('data-emoji-id', id);
  img.src = 'https://example.invalid/emoji.png';

  return img;
};

const message = (
  ...parts: readonly (string | HTMLImageElement)[]
): {
  messageElement: O.Option<Element>
  messageText: O.Option<string>
} => {
  const span = document.createElement('span');
  span.append(...parts);

  return {
    messageElement: O.some(span),
    messageText: O.some(span.textContent ?? ''),
  };
};

describe('isRepeatedContent', () => {
  it('matches equal message texts from different messages', () => {
    expect(isRepeatedContent(
      chatData({
        chatID: O.some('msg-2'),
        authorID: O.some('author-b'),
        ...message('草'),
      }),
      chatData({
        chatID: O.some('msg-1'),
        authorID: O.some('author-a'),
        ...message('草'),
      }),
    )).toBe(true);
  });

  it('ignores surrounding whitespace', () => {
    expect(isRepeatedContent(
      chatData(message(' 草 ')),
      chatData(message('草')),
    )).toBe(true);
  });

  it('distinguishes different texts', () => {
    expect(isRepeatedContent(
      chatData(message('草')),
      chatData(message('ww')),
    )).toBe(false);
  });

  it('matches equal emoji-only messages', () => {
    const id = 'UCNomdKfjGPeJCo3bXaHHPGw/h7LuZtSBIvWo_9EPzJ--8As';

    expect(isRepeatedContent(
      chatData(message(emoji(id), emoji(id), emoji(id))),
      chatData(message(emoji(id), emoji(id), emoji(id))),
    )).toBe(true);
  });

  it('distinguishes emoji-only messages by emoji count', () => {
    const id = 'UCNomdKfjGPeJCo3bXaHHPGw/h7LuZtSBIvWo_9EPzJ--8As';

    expect(isRepeatedContent(
      chatData(message(emoji(id), emoji(id))),
      chatData(message(emoji(id), emoji(id), emoji(id))),
    )).toBe(false);
  });

  it('distinguishes an emoji from its alt text', () => {
    expect(isRepeatedContent(
      chatData(message('きちゃ')),
      chatData(message(emoji('channel/id'))),
    )).toBe(false);
  });

  it('matches mixed text-and-emoji messages', () => {
    expect(isRepeatedContent(
      chatData(message('草', emoji('channel/id'))),
      chatData(message('草', emoji('channel/id'))),
    )).toBe(true);
  });

  it('falls back to message text without an element', () => {
    expect(isRepeatedContent(
      chatData({
        messageText: O.some('草'),
      }),
      chatData({
        messageText: O.some('草'),
      }),
    )).toBe(true);
  });

  it('never matches blank messages against each other', () => {
    expect(isRepeatedContent(
      chatData(message('  ')),
      chatData(message('  ')),
    )).toBe(false);
  });

  it('never matches absent messages against each other', () => {
    expect(isRepeatedContent(
      chatData({}),
      chatData({}),
    )).toBe(false);
  });

  it('never counts a paid candidate as a repeat', () => {
    expect(isRepeatedContent(
      chatData({
        ...message('Thanks!'),
        paymentInfo: O.some('$5.00'),
      }),
      chatData(message('Thanks!')),
    )).toBe(false);
  });

  it('counts a free candidate repeating a paid chat', () => {
    expect(isRepeatedContent(
      chatData(message('Thanks!')),
      chatData({
        ...message('Thanks!'),
        paymentInfo: O.some('$5.00'),
      }),
    )).toBe(true);
  });
});
