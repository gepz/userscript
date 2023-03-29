import * as E from '@effect/data/Either';
import {
  flow,
} from '@effect/data/Function';

export default <T1, T2>(
  f: (
    r: E.Either<never, T1>
  ) => E.Either<T2, T2>,
): (x: T1) => T2 => flow(
  E.right,
  f,
  E.merge,
);
