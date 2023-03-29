import * as E from '@effect/data/Either';
import {
  Refinement,
} from '@effect/data/Predicate';

export default <A, B extends A>(
  r: Refinement<A, B>,
) => <R, E>(
  f: (x: B) =>R,
): (x: E.Either<E, A>) => E.Either<R | E, Exclude<A, B>> => E.flatMap(
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  (x) => (r(x) ? E.left(f(x)) : E.right(x as Exclude<A, B>)
  ),
);
