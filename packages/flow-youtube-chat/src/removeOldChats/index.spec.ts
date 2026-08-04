// @vitest-environment happy-dom
import {
  Effect as Z,
  Either as E,
  SynchronizedRef,
} from 'effect';
import {
  describe,
  expect,
  it,
} from 'vitest';

import FlowChat from '@/FlowChat';
import chatDataFixture from '@/chatDataFixture';
import removeOldChats from '@/removeOldChats';

// happy-dom has no Web Animations API; a stub recording cancellation is
// all removeOldChats touches.
const stubAnimation = (onCancel: () => void): Animation => (
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  ({
    cancel: onCancel,
  }) as Animation
);

const flowChat = (
  animationState: FlowChat['animationState'],
): FlowChat => {
  const element = document.createElement('span');
  document.body.append(element);

  return {
    data: chatDataFixture(),
    element,
    lane: 0,
    animationState,
    width: 0,
    height: 0,
    y: 0,
  };
};

const trim = (
  chats: readonly FlowChat[],
  maxChatCount: number,
): Promise<readonly FlowChat[]> => Z.runPromise(Z.gen(function* () {
  const ref = yield * SynchronizedRef.make(chats);

  yield * removeOldChats(ref)(maxChatCount);

  return yield * SynchronizedRef.get(ref);
}));

describe('removeOldChats', () => {
  it('is a no-op at or below the cap', async () => {
    const chats = [
      flowChat(E.left('Ended')),
      flowChat(E.right(stubAnimation(() => {}))),
    ];

    expect(await trim(chats, 2)).toStrictEqual(chats);
    expect(chats[0]?.element.isConnected).toBe(true);
  });

  it('removes non-animating chats first, keeping insertion order', async () => {
    const a = flowChat(E.right(stubAnimation(() => {})));
    const b = flowChat(E.left('Ended'));
    const c = flowChat(E.right(stubAnimation(() => {})));
    const d = flowChat(E.left('Ended'));
    const e = flowChat(E.right(stubAnimation(() => {})));

    expect(await trim([a, b, c, d, e], 3)).toStrictEqual([a, c, e]);
    expect(b.element.isConnected).toBe(false);
    expect(d.element.isConnected).toBe(false);
    expect(a.element.isConnected).toBe(true);
  });

  it('falls back to the earliest animating chats and cancels them', async () => {
    const cancelled: string[] = [];
    const a = flowChat(E.right(stubAnimation(() => cancelled.push('a'))));
    const b = flowChat(E.left('Ended'));
    const c = flowChat(E.right(stubAnimation(() => cancelled.push('c'))));

    expect(await trim([a, b, c], 1)).toStrictEqual([c]);
    expect(cancelled).toStrictEqual(['a']);
    expect(a.element.isConnected).toBe(false);
    expect(c.element.isConnected).toBe(true);
  });

  it('clears everything at a cap of zero', async () => {
    const cancelled: string[] = [];
    const a = flowChat(E.right(stubAnimation(() => cancelled.push('a'))));
    const b = flowChat(E.left('NotStarted'));

    expect(await trim([a, b], 0)).toStrictEqual([]);
    expect(cancelled).toStrictEqual(['a']);
    expect(a.element.isConnected).toBe(false);
    expect(b.element.isConnected).toBe(false);
  });
});
