// @vitest-environment happy-dom
import {
  Effect as Z,
  Either as E,
  Option as O,
  SynchronizedRef,
} from 'effect';
import {
  render,
} from 'lit-html';
import {
  describe,
  expect,
  it,
} from 'vitest';

import ChatData from '@/ChatData';
import FlowChat from '@/FlowChat';
import MainState from '@/MainState';
import UserConfig from '@/UserConfig';
import chatNode from '@/chatNode';
import rendersNothing from '@/rendersNothing';

// Pins rendersNothing to the ground truth it restates: for every cell of
// a data-by-config grid, the predicate must agree with whether chatNode's
// actual rendered output is visibly empty (no text, no images). A
// visibility-rule change in chatNode that is not mirrored in the
// predicate fails here instead of drifting silently.

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

const emoji = (): HTMLImageElement => {
  const img = document.createElement('img');
  img.className = 'emoji';
  img.alt = 'きちゃ';
  img.src = 'https://example.invalid/emoji.png';

  return img;
};

const message = (
  ...parts: readonly (string | HTMLImageElement)[]
): Pick<ChatData, 'messageElement' | 'messageText'> => {
  const span = document.createElement('span');
  span.append(...parts);

  return {
    messageElement: O.some(span),
    messageText: O.some(span.textContent ?? ''),
  };
};

type Flags = Pick<
  UserConfig,
  'textOnly' | 'displayModName' | 'displaySuperChatAuthor'
>;

/* eslint-disable @typescript-eslint/consistent-type-assertions */
// chatNode reads only config.value and (through getChatFontSize)
// playerRect from MainState, so a slice of each is enough here.
const mainStateFor = (flags: Flags): MainState => ({
  config: {
    value: {
      displayChats: true,
      color: '#ffffff',
      ownerColor: '#ffd600',
      moderatorColor: '#c564ff',
      memberColor: '#9fffff',
      font: 'sans-serif',
      fontWeight: 730,
      chatOpacity: 0.8,
      shadowColor: '#000000',
      shadowFontWeight: 1,
      maxChatLength: 100,
      fontSize: 1,
      laneCount: 12,
      flowY1: 0,
      flowY2: 1,
      ...flags,
    } as UserConfig,
  },
  playerRect: Z.runSync(SynchronizedRef.make(
    {
      height: 720,
    } as DOMRectReadOnly,
  )),
} as MainState);
/* eslint-enable @typescript-eslint/consistent-type-assertions */

const renderedEmpty = (data: ChatData, mainState: MainState): boolean => {
  const flowChat: FlowChat = {
    data,
    element: document.createElement('span'),
    lane: 0,
    animationState: E.left('NotStarted'),
    width: 0,
    height: 0,
    y: 0,
  };

  const container = document.createElement('div');
  render(Z.runSync(chatNode(flowChat, mainState)), container);

  return (container.textContent ?? '').trim() === ''
    && container.querySelector('img') === null;
};

const dataCases: readonly {
  name: string
  data: ChatData
}[] = [
  {
    name: 'plain text',
    data: chatData(message('gg')),
  },
  {
    name: 'whitespace-only text',
    data: chatData(message('  ')),
  },
  {
    name: 'emoji only',
    data: chatData(message(emoji())),
  },
  {
    name: 'text and emoji',
    data: chatData(message('gg', emoji())),
  },
  {
    name: 'whitespace text and emoji',
    data: chatData(message('  ', emoji())),
  },
  {
    name: 'empty message element',
    data: chatData(message()),
  },
  {
    name: 'no message element',
    data: chatData({}),
  },
  {
    name: 'paid with text',
    data: chatData({
      ...message('Thanks!'),
      paymentInfo: O.some('$5.00'),
    }),
  },
  {
    name: 'paid with empty message',
    data: chatData({
      ...message(),
      paymentInfo: O.some('$5.00'),
    }),
  },
  {
    name: 'blank payment with empty message',
    data: chatData({
      ...message(),
      paymentInfo: O.some('  '),
    }),
  },
  {
    name: 'moderator with name, empty message',
    data: chatData({
      ...message(),
      authorType: 'moderator',
      authorName: O.some('mod'),
    }),
  },
  {
    name: 'payer with name, blank payment',
    data: chatData({
      ...message(),
      authorName: O.some('payer'),
      paymentInfo: O.some('  '),
    }),
  },
  {
    name: 'plain author with name, empty message',
    data: chatData({
      ...message(),
      authorName: O.some('viewer'),
    }),
  },
  {
    name: 'sticker with payment',
    data: chatData({
      stickerUrl: O.some('https://example.invalid/sticker.png'),
      paymentInfo: O.some('¥200'),
    }),
  },
  {
    // No payment info alongside it is not something YouTube produces, but
    // it isolates the sticker as the only thing that could render.
    name: 'sticker only',
    data: chatData({
      stickerUrl: O.some('https://example.invalid/sticker.png'),
    }),
  },
];

const flagGrid: readonly Flags[] = [false, true].flatMap(
  (textOnly) => [false, true].flatMap(
    (displayModName) => [false, true].map(
      (displaySuperChatAuthor): Flags => ({
        textOnly,
        displayModName,
        displaySuperChatAuthor,
      }),
    ),
  ),
);

describe('rendersNothing agrees with chatNode output', () => {
  it.each(dataCases)('$name', ({
    data,
  }) => {
    flagGrid.forEach((flags) => {
      const mainState = mainStateFor(flags);

      expect(
        renderedEmpty(data, mainState),
        `flags: ${JSON.stringify(flags)}`,
      ).toBe(rendersNothing(data, mainState.config.value));
    });
  });
});
