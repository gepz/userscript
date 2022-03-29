import {
  TypedArray,
} from 'bitecs';
import * as IO from 'fp-ts/IO';
import * as R from 'fp-ts/Reader';
import * as RA from 'fp-ts/ReadonlyArray';
import {
  flow,
} from 'fp-ts/function';

export default (
  id: number,
): R.Reader<readonly [TypedArray, TypedArray[number]][], IO.IO<void>> => flow(
  // eslint-disable-next-line no-param-reassign
  RA.map(([as, v]) => () => { as[id] = v; }),
  IO.sequenceArray,
);
