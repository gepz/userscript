import {
  Option as O,
  Array as A,
  Either as E,
  Effect as Z,
  Number as N,
  pipe,
  SynchronizedRef,
} from 'effect';
import {
  mapInput,
} from 'effect/Order';
import memoize from 'micro-memoize';

import FlowChat from '@/FlowChat';
import MainState from '@/MainState';
import getFlowChatRect from '@/getFlowChatRect';

export default (
  flowChat: FlowChat,
  chatIndex: O.Option<number>,
  progress: number,
) => ({
  config: {
    value: config,
  },
  flowChats,
  playerRect,
} : MainState): Z.Effect<{
  lane: number,
  interval: number,
// eslint-disable-next-line func-names
}> => Z.gen(function* () {
  const rect = yield* SynchronizedRef.get(playerRect);
  const flowWidth = rect.width * (
    config.flowX2 - config.flowX1
  );

  const {
    width: chatWidth,
    height: chatHeight,
    x: chatX,
  } = getFlowChatRect(flowChat, config, rect);

  const movingChats = pipe(
    yield* SynchronizedRef.get(flowChats),
    (chats) => A.take(chats, O.getOrElse(chatIndex, () => chats.length)),
    A.filter((chat) => E.isRight(chat.animationState) && chat.width > 0),
    A.sort(mapInput((x: FlowChat) => x.lane)(N.Order)),
  );

  const tooCloseTo = memoize((x: FlowChat) => {
    const {
      width: otherWidth,
      x: otherX,
    } = getFlowChatRect(x, config, rect);

    const gap = ((chatHeight * otherWidth * chatWidth) ** 0.333)
      * config.minSpacing;

    return ((flowWidth - otherX) / (flowWidth + otherWidth)) - progress
     < (chatWidth + gap) / (flowWidth + chatWidth)
     || otherX + otherWidth + gap > chatX;
  }, {
    maxSize: 1000,
  });

  const occupyInfo = pipe(
    movingChats,
    A.map((x) => ({
      tooClose: () => tooCloseTo(x),
      lane: x.lane,
    })),
    A.append({
      tooClose: (): boolean => true,
      lane: config.laneCount,
    }),
  );

  const index = pipe(
    occupyInfo,
    A.findFirstIndex((x) => x.lane >= flowChat.lane),
    O.getOrElse(() => -1),
  );

  const nextOccupiedLaneAbove = pipe(
    occupyInfo,
    A.take(index),
    A.findLast((x) => x.tooClose()),
    O.map((x) => x.lane),
    O.getOrElse(() => -1),
  );

  const nextOccupiedLaneBelow = pipe(
    occupyInfo,
    A.drop(index),
    A.findFirst((x) => x.tooClose()),
    O.map((x) => x.lane),
    O.getOrElse(() => config.laneCount),
  );

  const formerLaneInterval = Math.min(
    flowChat.lane - nextOccupiedLaneAbove,
    nextOccupiedLaneBelow - flowChat.lane,
    1,
  );

  return pipe(
    occupyInfo,
    A.reduce({
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
      const interLane = N.clamp({
        minimum: 0,
        maximum: config.laneCount - 1,
      })((lastLane + nextLane) / 2);

      const newInterval = Math.min(
        interLane - lastLane,
        nextLane - interLane,
        1,
      );

      return {
        lastLane: nextLane,
        ...((newInterval - maxInterval > 0.001) ? {
          maxInterval: newInterval,
          maxIntervalLane: Math.max(lastLane + newInterval, 0),
        } : {
          maxInterval,
          maxIntervalLane,
        }),
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
});
