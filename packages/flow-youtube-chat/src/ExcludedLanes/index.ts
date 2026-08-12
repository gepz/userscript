import {
  Array as A,
  Brand,
  Number as N,
  pipe,
} from 'effect';

// Sorted, deduped, non-negative integers — the shape allowedSegments'
// wall walk relies on. makeExcludedLanes is the one construction point,
// so every write path re-normalizes by construction.
type ExcludedLanes = readonly number[] & Brand.Brand<'ExcludedLanes'>;

export default ExcludedLanes;

const brand = Brand.nominal<ExcludedLanes>();

export const makeExcludedLanes = (
  lanes: readonly number[],
): ExcludedLanes => brand(pipe(
  lanes,
  A.filter((n) => Number.isInteger(n) && n >= 0),
  A.sort(N.Order),
  A.dedupeAdjacent,
));
