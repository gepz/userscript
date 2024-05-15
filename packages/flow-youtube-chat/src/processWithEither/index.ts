import {
  Either as E,
  pipe,
} from 'effect';

export default <T1, T2>(
  f: (
    r: E.Either<T1>
  ) => E.Either<T2, T2>,
) => (x: T1): T2 => pipe(
  E.right(x),
  f,
  E.merge,
);
