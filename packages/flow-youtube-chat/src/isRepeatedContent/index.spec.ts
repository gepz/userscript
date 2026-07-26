// @vitest-environment happy-dom
import {
  Option as O,
} from 'effect';
import {
  describe,
  expect,
  it,
} from 'vitest';

import chatDataFixture from '@/chatDataFixture';
import isRepeatedContent from '@/isRepeatedContent';

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
      chatDataFixture({
        chatID: O.some('msg-2'),
        authorID: O.some('author-b'),
        ...message('草'),
      }),
      chatDataFixture({
        chatID: O.some('msg-1'),
        authorID: O.some('author-a'),
        ...message('草'),
      }),
    )).toBe(true);
  });

  it('ignores surrounding whitespace', () => {
    expect(isRepeatedContent(
      chatDataFixture(message(' 草 ')),
      chatDataFixture(message('草')),
    )).toBe(true);
  });

  it('distinguishes different texts', () => {
    expect(isRepeatedContent(
      chatDataFixture(message('草')),
      chatDataFixture(message('ww')),
    )).toBe(false);
  });

  it('matches equal emoji-only messages', () => {
    const id = 'UCNomdKfjGPeJCo3bXaHHPGw/h7LuZtSBIvWo_9EPzJ--8As';

    expect(isRepeatedContent(
      chatDataFixture(message(emoji(id), emoji(id), emoji(id))),
      chatDataFixture(message(emoji(id), emoji(id), emoji(id))),
    )).toBe(true);
  });

  it('distinguishes emoji-only messages by emoji count', () => {
    const id = 'UCNomdKfjGPeJCo3bXaHHPGw/h7LuZtSBIvWo_9EPzJ--8As';

    expect(isRepeatedContent(
      chatDataFixture(message(emoji(id), emoji(id))),
      chatDataFixture(message(emoji(id), emoji(id), emoji(id))),
    )).toBe(false);
  });

  it('distinguishes an emoji from its alt text', () => {
    expect(isRepeatedContent(
      chatDataFixture(message('きちゃ')),
      chatDataFixture(message(emoji('channel/id'))),
    )).toBe(false);
  });

  it('matches mixed text-and-emoji messages', () => {
    expect(isRepeatedContent(
      chatDataFixture(message('草', emoji('channel/id'))),
      chatDataFixture(message('草', emoji('channel/id'))),
    )).toBe(true);
  });

  it('falls back to message text without an element', () => {
    expect(isRepeatedContent(
      chatDataFixture({
        messageText: O.some('草'),
      }),
      chatDataFixture({
        messageText: O.some('草'),
      }),
    )).toBe(true);
  });

  it('never matches blank messages against each other', () => {
    expect(isRepeatedContent(
      chatDataFixture(message('  ')),
      chatDataFixture(message('  ')),
    )).toBe(false);
  });

  it('never matches absent messages against each other', () => {
    expect(isRepeatedContent(
      chatDataFixture({}),
      chatDataFixture({}),
    )).toBe(false);
  });

  it('never counts a paid candidate as a repeat', () => {
    expect(isRepeatedContent(
      chatDataFixture({
        ...message('Thanks!'),
        paymentInfo: O.some('$5.00'),
      }),
      chatDataFixture(message('Thanks!')),
    )).toBe(false);
  });

  it('counts a free candidate repeating a paid chat', () => {
    expect(isRepeatedContent(
      chatDataFixture(message('Thanks!')),
      chatDataFixture({
        ...message('Thanks!'),
        paymentInfo: O.some('$5.00'),
      }),
    )).toBe(true);
  });
});
