// @vitest-environment happy-dom
import {
  Effect as Z,
  Either as E,
  Option as O,
  SynchronizedRef,
} from 'effect';
import {
  describe,
  expect,
  it,
} from 'vitest';

import ChatData from '@/ChatData';
import FlowChat from '@/FlowChat';
import removeRepeatedChats from '@/removeRepeatedChats';

const flowChat = (
  text: string,
  overrides?: Partial<ChatData>,
): FlowChat => {
  const messageElement = document.createElement('span');
  messageElement.append(text);

  const element = document.createElement('span');
  document.body.append(element);

  return {
    data: {
      chatType: 'normal',
      chatID: O.none(),
      authorType: 'normal',
      authorID: O.none(),
      authorName: O.none(),
      timestamp: O.none(),
      messageElement: O.some(messageElement),
      message: O.none(),
      messageText: O.some(text),
      paymentInfo: O.none(),
      textColor: O.none(),
      paidColor: O.none(),
      ...overrides,
    },
    element,
    lane: 0,
    animationState: E.left('NotStarted'),
    width: 0,
    height: 0,
    y: 0,
  };
};

describe('removeRepeatedChats', () => {
  it('keeps the earliest of each content and removes the rest', async () => {
    const first = flowChat('草');
    const other = flowChat('ww');
    const repeat = flowChat('草');

    const chats = await Z.runPromise(Z.gen(function* () {
      const ref = yield * SynchronizedRef.make<readonly FlowChat[]>([
        first,
        other,
        repeat,
      ]);

      yield * removeRepeatedChats(ref);

      return yield * SynchronizedRef.get(ref);
    }));

    expect(chats).toStrictEqual([first, other]);
    expect(repeat.element.isConnected).toBe(false);
    expect(first.element.isConnected).toBe(true);
  });

  it('keeps a paid chat repeating an earlier one', async () => {
    const first = flowChat('Thanks!');
    const paid = flowChat('Thanks!', {
      paymentInfo: O.some('$5.00'),
    });

    const chats = await Z.runPromise(Z.gen(function* () {
      const ref = yield * SynchronizedRef.make<readonly FlowChat[]>([
        first,
        paid,
      ]);

      yield * removeRepeatedChats(ref);

      return yield * SynchronizedRef.get(ref);
    }));

    expect(chats).toStrictEqual([first, paid]);
    expect(paid.element.isConnected).toBe(true);
  });
});
