import {
  pipe,
} from '@effect/data/Function';
import * as O from '@effect/data/Option';
import * as RA from '@effect/data/ReadonlyArray';
import * as tuple from '@effect/data/Tuple';
import * as Z from '@effect/io/Effect';
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
import * as Cause from '@effect/io/Cause';

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
): Z.Effect<never, never, boolean> => pipe(
  {
    fontSize: getChatFontSize(mainState),
  },
  Z.succeed,
  Z.tap((x) => Z.sync(() => {
    // eslint-disable-next-line no-param-reassign
    chat.element.style.transform = `translate(${
      mainState.playerRect.value.width
         * (mainState.config.value.flowX2 - mainState.config.value.flowX1)
    }px, -${x.fontSize * 2}px)`;
  })),
  Z.filterOrFail(
    () => !chat.animationEnded,
    () => Cause.NoSuchElementException(),
  ),
  Z.tap((x) => Z.sync(() => Object.assign(chat, {
    animationDuration: flowDuration,
    width: getWidth(chat.element.firstElementChild),
    height: x.fontSize,
  } satisfies Partial<FlowChat>))),
  Z.map(() => getFlowChatProgress(chat)),
  Z.map((progress) => ({
    currentTime: progress * flowDuration,
    ...pipe(
      getChatLane(chat, progress)(mainState),
      (x) => ({
        lane: x.lane,
        intervalTooSmall: intervalTooSmall(x.interval)(mainState.config.value)
      }),
    ),
  })),
  Z.filterOrElse(
    (x) => !x.intervalTooSmall,
    () => pipe(
      chat.animation,
      Z.tap((x) => Z.sync(() => x.finish())),
      Z.map(() => O.none()),
      Z.tap((none) => Z.sync(() => Object.assign(chat, {
        animation: none,
      } satisfies Partial<FlowChat>))),
      Z.flatten,
    ),
  ),
  Z.tap((x) => Z.sync(() => Object.assign(chat, {
    lane: x.lane,
  } satisfies Partial<FlowChat>))),
  Z.map((x) => ({
    currentTime: x.currentTime,
    laneY: getLaneY(x.lane, mainState),
  })),
  Z.tap(({
    currentTime,
    laneY,
  }) => pipe(
    [
      pipe(
        chat.animation,
        Z.flatMap((x) => Z.sync(() => x.cancel())),
        Z.ignore,
      ),
      pipe(
        [
          [
            mainState.playerRect.value.width
             * (mainState.config.value.flowX2 - mainState.config.value.flowX1),
            laneY,
          ],
          [
            -chat.width,
            laneY,
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
        (x) => Z.sync(() => chat.element.animate(x, {
          duration: flowDuration,
          easing: mainState.config.value.timingFunction,
        })),
        Z.tap((x) => Z.sync(() => {
          Object.assign(x, {
            onfinish: () => Object.assign(chat, {
              animationEnded: true,
            } satisfies Partial<FlowChat>),
            currentTime,
          } satisfies Partial<Animation>);
          Object.assign(chat, {
            y: laneY,
            animation: O.some(x),
          } satisfies Partial<FlowChat>)
        })),
        Z.zipRight(setChatPlayState(chat)(mainState)),
      ),
    ],
    Z.all,
  )),
  Z.isSuccess,
);
