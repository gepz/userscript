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
      mainState.playerRect.width
         * (mainState.config.flowX2 - mainState.config.flowX1)
    }px, -${x.fontSize * 2}px)`;
  })),
  Z.filterOrFail(() => !chat.animationEnded, O.none),
  Z.tap((x) => Z.sync(() => {
    // eslint-disable-next-line no-param-reassign
    chat.animationDuration = flowDuration;
    // eslint-disable-next-line no-param-reassign
    chat.width = getWidth(chat.element.firstElementChild);
    // eslint-disable-next-line no-param-reassign
    chat.height = x.fontSize;
  })),
  Z.map(() => getFlowChatProgress(chat)),
  Z.map((progress) => ({
    progress,
    ...getChatLane(
      chat,
      progress,
    )(mainState),
  })),
  Z.filterOrElse(
    (x) => !intervalTooSmall(x.interval)(mainState.config),
    () => pipe(
      chat.animation,
      Z.fromOption,
      Z.flatMap((x) => Z.sync(() => {
        x.finish();
        // eslint-disable-next-line no-param-reassign
        chat.animation = O.none();
      })),
      Z.zipRight(Z.fail(O.none())),
    ),
  ),
  Z.tap((x) => Z.sync(() => {
    // eslint-disable-next-line no-param-reassign
    chat.lane = x.lane;
  })),
  Z.map((x) => ({
    ...x,
    laneY: getLaneY(chat.lane, mainState),
  })),
  Z.tap((ctx) => pipe(
    [
      pipe(
        chat.animation,
        Z.fromOption,
        Z.flatMap((x) => Z.sync(() => x.cancel())),
        Z.ignore,
      ),
      pipe(
        [
          [
            mainState.playerRect.width
             * (mainState.config.flowX2 - mainState.config.flowX1),
            ctx.laneY,
          ],
          [
            -chat.width,
            ctx.laneY,
          ],
        ] as const,
        RA.map(pipe(
          (x: number) => `${x}px`,
          (x) => tuple.bimap(x, x),
        )),
        RA.map((([x, y]) => `translate(${x}, ${y})`)),
        RA.bindTo('transform'),
        (x) => Z.sync(() => chat.element.animate(x, {
          duration: flowDuration,
          easing: mainState.config.timingFunction,
        })),
        Z.tap((x) => Z.sync(() => {
          // eslint-disable-next-line no-param-reassign
          x.onfinish = () => {
            // eslint-disable-next-line no-param-reassign
            chat.animationEnded = true;
          };

          // eslint-disable-next-line no-param-reassign
          chat.y = ctx.laneY;
          const newTime = ctx.progress * flowDuration;
          // eslint-disable-next-line no-param-reassign
          x.currentTime = newTime;
        })),
        Z.flatMap((x) => Z.sync(() => {
          // eslint-disable-next-line no-param-reassign
          chat.animation = O.some(x);
        })),
        Z.zipRight(setChatPlayState(chat)(mainState)),
      ),
    ],
    (x) => Z.all(x),
  )),
  Z.isSuccess,
);
