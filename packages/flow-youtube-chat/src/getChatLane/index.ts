import {
  pipe,
} from '@effect/data/Function';
import * as N from '@effect/data/Number';
import * as O from '@effect/data/Option';
import * as RA from '@effect/data/ReadonlyArray';
import {
  contramap,
} from '@effect/data/typeclass/Order';
import memoize from 'micro-memoize';

import FlowChat from '@/FlowChat';
import MainState from '@/MainState';
import getFlowChatRect from '@/getFlowChatRect';

export default (
  flowChat: FlowChat,
  progress: number,
) => (
  mainState: MainState,
): {
  lane: number,
  interval: number,
} => {
  const flowWidth = mainState.playerRect.width * (
    mainState.config.flowX2 - mainState.config.flowX1
  );

  const chatRect = getFlowChatRect(flowChat, mainState);
  const chatWidth = chatRect.width;
  const chatHeight = chatRect.height;
  const chatX = chatRect.x;
  const {
    flowChats,
  } = mainState;

  const chatIndex = flowChats.indexOf(flowChat);
  const movingChats = pipe(
    flowChats,
    RA.take(chatIndex >= 0 ? chatIndex : flowChats.length),
    RA.filter((chat) => !chat.animationEnded && chat.width > 0),
    RA.sort(contramap((x: FlowChat) => x.lane)(N.Order)),
  );

  const tooCloseTo = memoize((x: FlowChat) => {
    const otherRect = getFlowChatRect(x, mainState);
    const otherWidth = otherRect.width;
    const otherX = otherRect.x;
    const gap = ((chatHeight * otherWidth * chatWidth) ** 0.333)
      * mainState.config.minSpacing;

    return ((flowWidth - otherX) / (flowWidth + otherWidth)) - progress
     < (chatWidth + gap) / (flowWidth + chatWidth)
     || otherX + otherWidth + gap > chatX;
  }, {
    maxSize: 1000,
  });

  const occupyInfo = pipe(
    movingChats,
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    RA.map((x) => ({
      tooClose: () => tooCloseTo(x),
      lane: x.lane,
    })),
    RA.append({
      tooClose: (): boolean => true,
      lane: mainState.config.laneCount,
    }),
  );

  const index = occupyInfo.findIndex((x) => x.lane >= flowChat.lane);
  const bottomFreeLane = pipe(
    occupyInfo.slice(index),
    RA.findFirst((x) => x.tooClose()),
    O.map((x) => x.lane),
    O.getOrElse(() => mainState.config.laneCount),
  );

  const topFreeLane = pipe(
    occupyInfo.slice(0, index),
    RA.findLast((x) => x.tooClose()),
    O.map((x) => x.lane),
    O.getOrElse(() => -1),
  );

  const formerLaneInterval = Math.min(
    flowChat.lane - topFreeLane,
    bottomFreeLane - flowChat.lane,
    1,
  );

  return pipe(
    occupyInfo,
    RA.reduce({
      maxInterval: 0,
      maxIntervalLane: 0,
      lastLane: -1,
    }, ({
      maxInterval,
      maxIntervalLane,
      lastLane,
    }, info) => ((maxInterval > 0.999 || !info.tooClose()) ? {
      maxInterval,
      maxIntervalLane,
      lastLane,
    }
    : (() => {
      const nextLane = info.lane;
      const interLane = Math.min(
        Math.max((lastLane + nextLane) / 2, 0),
        mainState.config.laneCount - 1,
      );

      const newInterval = Math.min(
        interLane - lastLane,
        nextLane - interLane,
        1,
      );

      return (newInterval - maxInterval > 0.001) ? {
        maxInterval: newInterval,
        maxIntervalLane: Math.max(lastLane + newInterval, 0),
        lastLane: nextLane,
      } : {
        maxInterval,
        maxIntervalLane,
        lastLane: nextLane,
      };
    })())),
    (x) => ({
      lane: Math.abs(
        formerLaneInterval - x.maxInterval,
      ) < 0.001 ? flowChat.lane
      : x.maxIntervalLane,
      interval: x.maxInterval,
    }),
  );
};
