import {
  Array as A,
  Effect as Z,
  Option as O,
  Cause,
} from 'effect';
import {
  pipe,
} from 'effect/Function';
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
  Z.succeed(getChatFontSize(mainState)),
  Z.tap((height) => Z.sync(() => {
    // eslint-disable-next-line no-param-reassign
    chat.element.style.transform = `translate(${
      mainState.playerRect.value.width
         * (mainState.config.value.flowX2 - mainState.config.value.flowX1)
    }px, -${height * 2}px)`;
  })),
  Z.filterOrFail(() => !chat.animationEnded),
  Z.map((height) => ({
    newChat: {
      ...chat,
      width: getWidth(chat.element.firstElementChild),
      height,
    } satisfies FlowChat,
    oldChatIndex: pipe(
      mainState.flowChats.value,
      A.findFirstIndex((x) => x === chat),
    ),
    progress: getFlowChatProgress(chat.animation),
  })),
  Z.flatMap((ctx) => pipe(
    getChatLane(ctx.newChat, ctx.oldChatIndex, ctx.progress)(mainState),
    ({
      lane, interval,
    }) => pipe(
      intervalTooSmall(interval)(mainState.config.value)
        ? ctx.newChat.animation.pipe(
          Z.tap((x) => Z.sync(() => x.finish())),
          Z.map((): FlowChat => ({
            ...ctx.newChat,
            animation: O.none(),
          })),
          Z.orElse(() => Z.succeed<FlowChat>(ctx.newChat)),
        ) : setNewChatAnimation(ctx.newChat)(lane)(ctx.progress)(mainState),
      Z.map((x): typeof ctx => ({
        ...ctx,
        newChat: x,
      })),
    ),
  )),
  Z.tap((x) => setChatPlayState(x.newChat)(mainState)),
  Z.flatMap((x) => O.match(x.oldChatIndex, {
    onNone: () => Z.succeed({
      newChat: x.newChat,
    }),
    onSome: (index) => pipe(
      Z.sync(() => mainState.flowChats.next(
        A.replace(mainState.flowChats.value, index, x.newChat),
      )),
      Z.zipRight(Z.fail(new Cause.NoSuchElementException())),
    ),
  })),
);
