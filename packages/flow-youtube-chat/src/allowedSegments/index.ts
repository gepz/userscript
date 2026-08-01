import {
  Array as A,
  pipe,
} from 'effect';

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
 * trims it.
 *
 * Relies on excludedLanes being sorted, deduped, non-negative integers —
 * the excludedLanes decoder in defaultGMConfig normalizes storage to
 * exactly that shape.
 */
export default (
  excludedLanes: readonly number[],
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
