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
import rendersNothing from '@/rendersNothing';

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

const config = (overrides?: Partial<{
  textOnly: boolean
  displayModName: boolean
  displaySuperChatAuthor: boolean
}>): Parameters<typeof rendersNothing>[1] => ({
  textOnly: false,
  displayModName: true,
  displaySuperChatAuthor: true,
  ...overrides,
});

const emojiOnlyMessage = (): HTMLElement => {
  const message = document.createElement('span');
  message.append(document.createElement('img'));

  return message;
};

describe('rendersNothing', () => {
  it('keeps a plain text message', () => {
    expect(rendersNothing(chatData({
      messageText: O.some('hello'),
    }), config())).toBe(false);
  });

  it('keeps an emoji-only message while emojis render', () => {
    expect(rendersNothing(chatData({
      messageElement: O.some(emojiOnlyMessage()),
      messageText: O.some(''),
    }), config())).toBe(false);
  });

  it('drops an emoji-only message under textOnly', () => {
    expect(rendersNothing(chatData({
      messageElement: O.some(emojiOnlyMessage()),
      messageText: O.some(''),
    }), config({
      textOnly: true,
    }))).toBe(true);
  });

  it('drops a whitespace-only message', () => {
    expect(rendersNothing(chatData({
      messageText: O.some('  '),
    }), config())).toBe(true);
  });

  it('drops a fully empty chat', () => {
    expect(rendersNothing(chatData({}), config())).toBe(true);
  });

  it('keeps an empty message when payment info shows', () => {
    expect(rendersNothing(chatData({
      messageText: O.some(''),
      paymentInfo: O.some('$5.00'),
    }), config({
      textOnly: true,
      displaySuperChatAuthor: false,
    }))).toBe(false);
  });

  it('drops a chat whose only payment info is blank', () => {
    expect(rendersNothing(chatData({
      messageText: O.some(''),
      paymentInfo: O.some(' '),
    }), config({
      displaySuperChatAuthor: false,
    }))).toBe(true);
  });

  it('keeps an empty message from a moderator whose name shows', () => {
    const data = chatData({
      authorType: 'moderator',
      authorName: O.some('Mod'),
      messageText: O.some(''),
    });

    expect(rendersNothing(data, config())).toBe(false);
    expect(rendersNothing(data, config({
      displayModName: false,
    }))).toBe(true);
  });

  it('keeps a payer name with blank payment text when the author shows', () => {
    expect(rendersNothing(chatData({
      authorName: O.some('Payer'),
      paymentInfo: O.some(' '),
      messageText: O.some(''),
    }), config())).toBe(false);
  });
});
