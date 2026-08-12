import {
  Option as O,
  Array as A,
  Either as E,
  Effect as Z,
  Number as N,
  pipe,
} from 'effect';
import {
  mapInput,
} from 'effect/Order';
import {
  memoize,
} from 'micro-memoize';

import FlowChat from '@/FlowChat';
import MainState from '@/MainState';
import allowedSegments, {
  LaneSegment,
} from '@/allowedSegments';
import getFlowChatRect from '@/getFlowChatRect';

export default (
  flowChat: FlowChat,
  chatIndex: O.Option<number>,
  progress: number,
) => Z.fnUntraced(function* ({
  config: {
    value: config,
  },
  flowChats,
  playerRect,
}: MainState) {
  const rect = yield * playerRect;
  const flowWidth = rect.width * (
    config.flowX2 - config.flowX1
  );

  const {
    width: chatWidth,
    height: chatHeight,
    x: chatX,
  } = getFlowChatRect(flowChat, config, rect);

  const movingChats = pipe(
    yield * flowChats,
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
  );

  // Applies regardless of noOverlap — see allowedSegments.
  const segments = allowedSegments(config.excludedLanes, config.laneCount);

  // Intervals measure clearance in lanes, capped at 1 (a full gap);
  // differences within epsilon are ties, and an interval past
  // fullInterval cannot be improved on.
  const epsilon = 0.001;
  const fullInterval = 0.999;

  // Chats whose vertical span can reach into [start, end), plus a
  // sentinel blocker at the segment's bottom wall; the top wall enters
  // the scan as the initial laneAbove instead.
  const segmentEntries = ({
    start, end,
  }: LaneSegment) => pipe(
    occupyInfo,
    A.filter((x) => x.lane > start - 1 && x.lane < end),
    A.append({
      tooClose: (): boolean => true,
      lane: end,
    }),
  );

  // The gap between two blocking lanes admits one placement candidate:
  // the chat hugs the blocker above it (the midpoint when the gap is
  // narrower than two lanes), clamped into the segment's lane range.
  const placementCandidate = ({
    start, end,
  }: LaneSegment) => (laneAbove: number, laneBelow: number) => {
    const midLane = N.clamp({
      minimum: start,
      maximum: end - 1,
    })((laneAbove + laneBelow) / 2);

    const interval = Math.min(midLane - laneAbove, laneBelow - midLane, 1);

    return {
      interval,
      lane: Math.max(laneAbove + interval, start),
    };
  };

  // Widest-gap scan, one pass per segment: non-blocking entries are
  // transparent (gaps span across them), and a full gap settles the scan
  // — later tooClose() calls stay unevaluated.
  const scanSegment = (segment: LaneSegment) => pipe(
    segmentEntries(segment),
    A.reduce({
      candidate: {
        lane: segment.start,
        interval: 0,
      },
      laneAbove: segment.start - 1,
    }, (acc, info) => {
      if (acc.candidate.interval > fullInterval || !info.tooClose()) {
        return acc;
      }

      const candidate = placementCandidate(segment)(acc.laneAbove, info.lane);

      return {
        laneAbove: info.lane,
        candidate: candidate.interval - acc.candidate.interval > epsilon
          ? candidate
          : acc.candidate,
      };
    }),
    (x) => x.candidate,
  );

  const bestPlacement = pipe(
    segments,
    A.map(scanSegment),
    A.reduce(
      O.none<{
        interval: number
        lane: number
      }>(),
      (best, candidate) => pipe(
        best,
        O.filter((x) => candidate.interval - x.interval <= epsilon),
        O.orElse(() => O.some(candidate)),
      ),
    ),
  );

  // Clearance the chat keeps by staying in its current lane: distance to
  // the nearest blocker on each side. Defined only when the chat's full
  // height lies inside an allowed segment.
  const stayInterval = pipe(
    segments,
    A.findFirst(({
      start, end,
    }) => start <= flowChat.lane && flowChat.lane <= end - 1),
    O.map((segment) => {
      const entries = segmentEntries(segment);

      // The sentinel guarantees a match.
      const index = pipe(
        entries,
        A.findFirstIndex((x) => x.lane >= flowChat.lane),
        O.getOrElse(() => entries.length),
      );

      const blockerAbove = pipe(
        entries,
        A.take(index),
        A.findLast((x) => x.tooClose()),
        O.map((x) => x.lane),
        O.getOrElse(() => segment.start - 1),
      );

      const blockerBelow = pipe(
        entries,
        A.drop(index),
        A.findFirst((x) => x.tooClose()),
        O.map((x) => x.lane),
        O.getOrElse(() => segment.end),
      );

      return Math.min(
        flowChat.lane - blockerAbove,
        blockerBelow - flowChat.lane,
        1,
      );
    }),
  );

  // Moving buys nothing when staying is as clear as the widest gap —
  // prefer lane stability. None means no legal placement exists (every
  // lane excluded): the caller drops the chat.
  return O.map(bestPlacement, (best) => ({
    lane: pipe(
      stayInterval,
      O.filter((x) => Math.abs(x - best.interval) < epsilon),
      O.match({
        onNone: () => best.lane,
        onSome: () => flowChat.lane,
      }),
    ),
    interval: best.interval,
  }));
});
