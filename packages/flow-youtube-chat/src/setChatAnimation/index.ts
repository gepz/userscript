import {
  Array as A,
  Effect as Z,
  Option as O,
  Either as E,
  Cause,
  pipe,
  SynchronizedRef,
} from 'effect';
import hash from 'hash-it';
import memoize from 'micro-memoize';

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

export default (
  chat: FlowChat,
) => (
  mainState: MainState,
): Z.Effect<{
  newChat: FlowChat,
}, Cause.NoSuchElementException> => pipe(
  getChatFontSize(mainState),
  // eslint-disable-next-line func-names
  Z.tap((height) => Z.gen(function* () {
    // eslint-disable-next-line no-param-reassign
    chat.element.style.transform = `translate(${
      (yield* SynchronizedRef.get(mainState.playerRect)).width
         * (mainState.config.value.flowX2 - mainState.config.value.flowX1)
    }px, -${height * 2}px)`;
  })),
  Z.filterOrFail(() => E.match(chat.animationState, {
    onLeft: (x) => x === 'NotStarted',
    onRight: () => true,
  })),
  // eslint-disable-next-line func-names
  Z.flatMap((height) => Z.gen(function* () {
    return {
      newChat: {
        ...chat,
        width: getWidth(chat.element.firstElementChild),
        height,
      } satisfies FlowChat,
      oldChatIndex: pipe(
        yield* SynchronizedRef.get(mainState.flowChats),
        A.findFirstIndex((x) => x === chat),
      ),
      progress: getFlowChatProgress(chat.animationState),
    };
  })),
  Z.flatMap((ctx) => getChatLane(
    ctx.newChat,
    ctx.oldChatIndex,
    ctx.progress,
  )(mainState).pipe(
    Z.flatMap(({
      lane, interval,
    }) => (intervalTooSmall(interval)(mainState.config.value)
      ? ctx.newChat.animationState.pipe(
        Z.tap((x) => Z.sync(() => x.finish())),
        Z.map((): FlowChat => ({
          ...ctx.newChat,
          animationState: E.left('Ended'),
        })),
        Z.orElse(() => Z.succeed<FlowChat>(ctx.newChat)),
      ) : setNewChatAnimation(ctx.newChat)(lane)(ctx.progress)(mainState))),
    Z.map((x) => ({
      oldChatIndex: ctx.oldChatIndex,
      newChat: x,
    })),
  )),
  Z.tap((x) => setChatPlayState(x.newChat)(mainState)),
  Z.flatMap((x) => O.match(x.oldChatIndex, {
    onNone: () => Z.succeed({
      newChat: x.newChat,
    }),
    onSome: (index) => pipe(
      SynchronizedRef.update(mainState.flowChats, A.replace(index, x.newChat)),
      Z.zipRight(Z.fail(new Cause.NoSuchElementException())),
    ),
  })),
);
