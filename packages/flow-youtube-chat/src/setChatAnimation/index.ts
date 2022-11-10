import * as IO from 'fp-ts/IO';
import * as IOO from 'fp-ts/IOOption';
import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import {
  pipe,
  flow,
} from 'fp-ts/function';
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
    transformKey: flow(
      RA.map(hash),
      RA.toArray,
    ),
  },
);

export default (
  chat: FlowChat,
  chats: FlowChat[],
) => (
  mainState: MainState,
): IO.IO<boolean> => pipe(
  {
    fontSize: getChatFontSize(mainState),
  },
  IO.of,
  IO.chainFirst(
    (x) => () => {
      // eslint-disable-next-line no-param-reassign
      chat.element.style.transform = `translate(${
        mainState.playerRect.width
         * (mainState.getConfig.flowX2() - mainState.getConfig.flowX1())
      }px, -${x.fontSize * 2}px)`;
    },
  ),
  IOO.fromIO,
  IOO.filter(() => !chat.animationEnded),
  IOO.chainFirstIOK((x) => () => {
    // eslint-disable-next-line no-param-reassign
    chat.animationDuration = flowDuration;
    // eslint-disable-next-line no-param-reassign
    chat.width = getWidth(chat.element.firstElementChild);
    // eslint-disable-next-line no-param-reassign
    chat.height = x.fontSize;
  }),
  IOO.map(() => ({
    progress: getFlowChatProgress(chat),
  })),
  IOO.map((x) => ({
    ...x,
    ...getChatLane(
      chat,
      x.progress,
      chats,
    )(mainState),
  })),
  IOO.chain((ctx) => (
    (intervalTooSmall(ctx.interval)(mainState.getConfig)) ? pipe(
      chat.animation,
      IOO.fromOption,
      IOO.chainIOK((x) => () => {
        x.finish();
        // eslint-disable-next-line no-param-reassign
        chat.animation = O.none;
      }),
      IO.map(() => O.none),
    )
    : IOO.of(ctx)
  )),
  IOO.chainFirstIOK((x) => () => {
    // eslint-disable-next-line no-param-reassign
    chat.lane = x.lane;
  }),
  IOO.map((x) => ({
    ...x,
    laneY: getLaneY(chat.lane, mainState),
  })),
  IOO.chain((ctx) => pipe(
    [
      pipe(
        chat.animation,
        IOO.fromOption,
        IOO.chainIOK((x) => () => x.cancel()),
      ),
      pipe(
        [
          [
            mainState.playerRect.width
             * (mainState.getConfig.flowX2() - mainState.getConfig.flowX1()),
            ctx.laneY,
          ],
          [
            -chat.width,
            ctx.laneY,
          ],
        ],
        RA.map(RA.map(((x) => `${x}px`))),
        RA.map((([x, y]) => `translate(${x}, ${y})`)),
        RA.bindTo('transform'),
        RA.toArray,
        (x) => chat.element.animate(x, {
          duration: flowDuration,
          easing: mainState.getConfig.timingFunction(),
        }),
        (x) => {
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

          return x;
        },
        O.of,
        (x) => () => {
          // eslint-disable-next-line no-param-reassign
          chat.animation = x;
        },
        IO.apSecond(setChatPlayState(chat)(mainState)),
      ),
    ],
    IO.sequenceArray,
    IOO.fromIO,
  )),
  IO.map(O.isSome),
);
