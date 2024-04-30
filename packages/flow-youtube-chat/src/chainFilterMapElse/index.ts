import {
  Either as E,
} from 'effect';
import {
  Refinement,
} from 'effect/Predicate';

export default <A, B extends A>(
  r: Refinement<A, B>,
) => <R, E>(
  f: (x: B) => R,
) => (
  x: E.Either<A, E>,
): E.Either<Exclude<A, B>, R | E> => (E.isLeft(x) ? E.left(x.left)
: r(x.right) ? E.left(f(x.right))
// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
: E.right(x.right as Exclude<A, B>));
