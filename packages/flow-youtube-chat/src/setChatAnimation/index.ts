import {
  pipe,
} from 'effect/Function';
import * as O from 'effect/Option';
import * as RA from 'effect/ReadonlyArray';
import * as tuple from 'effect/Tuple';
import * as Z from 'effect/Effect';
import hash from 'hash-it';
import memoize from 'micro-memoize';

import FlowChat from '@/FlowChat';
import MainState from '@/MainState';
import flowDuration from '@/flowDuration';
import getChatFontSize from '@/getChatFontSize';
import getChatLane from '@/getChatLane';
import getFlowChatProgress from '@/getFlowChatProgress';
import getLaneY from '@/getLaneY';
import intervalTooSmall from '@/intervalTooSmall';
import setChatPlayState from '@/setChatPlayState';
import * as Cause from 'effect/Cause';

const getWidth = memoize(
  (ele: Element | null): number => ele?.getBoundingClientRect().width ?? 0,
  {
    maxSize: 2000,
    transformKey: RA.map(hash),
  },
);

export default (
  chat: FlowChat,
) => (
  mainState: MainState,
): Z.Effect<never, Cause.NoSuchElementException, {
  newChat: FlowChat,
}> => pipe(
  Z.succeed(getChatFontSize(mainState)),
  Z.tap((height) => Z.sync(() => {
    // eslint-disable-next-line no-param-reassign
    chat.element.style.transform = `translate(${
      mainState.playerRect.value.width
         * (mainState.config.value.flowX2 - mainState.config.value.flowX1)
    }px, -${height * 2}px)`;
  })),
  Z.filterOrFail(
    () => !chat.animationEnded,
    () => Cause.NoSuchElementException(),
  ),
  Z.map((height) => (
  {
    newChat: {
      ...chat,
      width: getWidth(chat.element.firstElementChild),
      height,
    } satisfies FlowChat,
    oldChatIndex: pipe(
      mainState.flowChats.value,
      RA.findFirstIndex((x) => x === chat),
    ),
    progress: getFlowChatProgress(chat.animation),
  })),
  Z.map((ctx) => pipe(
    getChatLane(ctx.newChat, ctx.oldChatIndex, ctx.progress)(mainState),
    (x) => ({
      newChat: {
        ...ctx.newChat,
        lane: x.lane,
      } satisfies FlowChat,
      oldChatIndex: ctx.oldChatIndex,
      currentTime: ctx.progress * flowDuration,
      intervalTooSmall: intervalTooSmall(x.interval)(mainState.config.value)
    }),
  )),
  Z.filterOrElse(
    (x) => !x.intervalTooSmall,
    (x) => pipe(
      x.newChat.animation,
      Z.tap((x) => Z.sync(() => x.finish())),
      Z.map((): typeof x => ({
        ...x,
        newChat: {
          ...x.newChat,
          animation: O.none(),
        },
      })),
    ),
  ),
  Z.map((x): typeof x => ({
    ...x,
    newChat: {
      ...x.newChat,
      y: getLaneY(x.newChat.lane, mainState),
    }
  })),
  Z.tap((x) => pipe(
    x.newChat.animation,
    O.match(({
      onNone: () => Z.unit,
      onSome: (x) => Z.sync(() => x.cancel()),
    })),
  )),
  Z.flatMap((ctx) => pipe(
    [
      [
        mainState.playerRect.value.width
          * (mainState.config.value.flowX2 - mainState.config.value.flowX1),
        ctx.newChat.y,
      ],
      [
        -ctx.newChat.width,
        ctx.newChat.y,
      ],
    ] as const,
    RA.map(pipe(
      (x: number) => `${x}px`,
      (x) => tuple.mapBoth({
        onFirst: x,
        onSecond: x,
      }),
    )),
    RA.map((([x, y]) => ({
      transform: `translate(${x}, ${y})`,
    }))),
    (x) => Z.sync(() => ctx.newChat.element.animate(x, {
      duration: flowDuration,
      easing: mainState.config.value.timingFunction,
    })),
    Z.tap((x) => Z.sync(() => {
      Object.assign(x, {
        onfinish: () => Object.assign(ctx.newChat, {
          animationEnded: true,
        } satisfies Partial<FlowChat>),
        currentTime: ctx.currentTime,
      } satisfies Partial<Animation>);
    })),
    Z.map((x) => ({
      oldChatIndex: ctx.oldChatIndex,
      newChat: {
        ...ctx.newChat,
        animation: O.some(x),
      } satisfies FlowChat,
    })),
  )),
  Z.tap((x) => setChatPlayState(x.newChat)(mainState)),
  Z.flatMap((x) => O.match(x.oldChatIndex, {
    onNone: () => Z.succeed({
      newChat: x.newChat,
    }),
    onSome: (index) => pipe(
      Z.sync(() => mainState.flowChats.next(
        RA.replace(mainState.flowChats.value, index, x.newChat)
      )),
      Z.zipRight(Z.fail(Cause.NoSuchElementException())),
    ),
  })),
);
