import {
  Array as A,
  pipe,
} from 'effect';

import type ExcludedLanes from '@/ExcludedLanes';

export interface LaneSegment {
  readonly start: number
  readonly end: number
}

/**
 * Partitions the lane axis [0, laneCount) into the maximal runs of rows
 * not in excludedLanes. Excluded lanes are walls: no placement may
 * intersect them, so chat placement runs once per segment and never
 * across one. Lanes at or beyond laneCount are ignored, which keeps an
 * excluded set saved under a larger laneCount harmless until a write
 * trims it. The walk relies on the sorted, deduped shape ExcludedLanes
 * carries by construction.
 */
export default (
  excludedLanes: ExcludedLanes,
  laneCount: number,
): readonly LaneSegment[] => pipe(
  excludedLanes,
  A.filter((x) => x < laneCount),
  A.append(laneCount),
  A.reduce({
    segments: A.empty<LaneSegment>(),
    start: 0,
  }, (acc, excluded) => ({
    start: excluded + 1,
    segments: excluded > acc.start
      ? A.append(acc.segments, {
        start: acc.start,
        end: excluded,
      })
      : acc.segments,
  })),
  (x) => x.segments,
);
