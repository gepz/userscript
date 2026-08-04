import {
  Array as A,
  Effect as Z,
  Option as O,
  Either as E,
  pipe,
  SynchronizedRef,
} from 'effect';
import {
  hash,
} from 'hash-it';
import {
  memoize,
} from 'micro-memoize';

import FlowChat from '@/FlowChat';
import MainState from '@/MainState';
import getChatFontSize from '@/getChatFontSize';
import getChatLane from '@/getChatLane';
import getFlowChatProgress from '@/getFlowChatProgress';
import intervalTooSmall from '@/intervalTooSmall';
import setChatPlayState from '@/setChatPlayState';
import setNewChatAnimation from '@/setNewChatAnimation';

const getWidth = memoize(
  (ele: Element | null): number => ele?.getBoundingClientRect().width ?? 0,
  {
    maxSize: 2000,
    transformKey: A.map(hash),
  },
);

/**
 * (Re)places one chat: measures it, picks a lane, and starts (or drops)
 * its flight. Some(newChat) hands a fresh chat — never stored here —
 * back to the caller to store or discard; None means there is nothing
 * for the caller to do: the chat was an already-finished one (left
 * as-is), or an existing entry replaced in place. The in-place replace
 * locates the entry by identity inside one atomic update — an index
 * taken before the update could go stale against the concurrent
 * `flowChats` writers (see the claim step in @/addFlowChat) and clobber
 * the wrong entry. A chat evicted while its re-placement was computing
 * is gone: the freshly created flight is cancelled, not stored.
 */
export default (
  chat: FlowChat,
) => (
  mainState: MainState,
): Z.Effect<O.Option<FlowChat>> => Z.gen(function* () {
  const height = yield * getChatFontSize(mainState);

  chat.element.style.transform = `translate(${
    (yield * mainState.playerRect).width
    * (mainState.config.value.flowX2 - mainState.config.value.flowX1)
  }px, -${height * 2}px)`;

  // Only fresh ('NotStarted') and flying chats are placeable; a finished
  // chat stays finished until recycled.
  if (E.match(chat.animationState, {
    onLeft: (x) => x !== 'NotStarted',
    onRight: () => false,
  })) {
    return O.none();
  }

  const newChat: FlowChat = {
    ...chat,
    width: getWidth(chat.element.firstElementChild),
    height,
  };

  // Heuristic input only (which chats count as "inserted before me");
  // the store below never trusts it.
  const chatIndex = pipe(
    yield * mainState.flowChats,
    A.findFirstIndex((x) => x === chat),
  );

  const progress = getFlowChatProgress(chat.animationState);

  const placed = yield * getChatLane(newChat, chatIndex, progress)(mainState)
    .pipe(Z.flatMap((placement) => pipe(
      placement,
      // None: every row is banned, nowhere legal to place. Dropped the
      // same way as a too-small interval.
      O.filter(({
        interval,
      }) => !intervalTooSmall(interval)(mainState.config.value)),
      O.match({
        onNone: () => newChat.animationState.pipe(
          Z.tap((x) => Z.sync(() => x.finish())),
          Z.map((): FlowChat => ({
            ...newChat,
            animationState: E.left('Ended'),
          })),
          Z.orElse(() => Z.succeed(newChat)),
        ),
        onSome: ({
          lane,
        }) => setNewChatAnimation(newChat)(lane)(progress)(mainState),
      }),
    )));

  yield * setChatPlayState(placed)(mainState);

  if (E.isLeft(chat.animationState)) {
    return O.some(placed);
  }

  return yield * SynchronizedRef.modifyEffect(
    mainState.flowChats,
    (chats): Z.Effect<readonly [O.Option<FlowChat>, readonly FlowChat[]]> => (
      pipe(
        A.findFirstIndex(chats, (x) => x === chat),
        O.match({
          onNone: () => placed.animationState.pipe(
            Z.tap((animation) => Z.sync(() => animation.cancel())),
            Z.ignore,
            Z.map(() => [O.none<FlowChat>(), chats] as const),
          ),
          onSome: (index) => Z.succeed([
            O.none<FlowChat>(),
            A.replace(chats, index, placed),
          ] as const),
        }),
      )
    ),
  );
});
