import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as R from 'fp-ts/Reader';
import {
  pipe,
} from 'fp-ts/function';

const chainOptionElse = <A, B, E>(
  f: R.Reader<A, O.Option<B>>,
): R.Reader<E.Either<E, A>, E.Either<B | E, A>> => E.chainW(
  (x) => pipe(
    f(x),
    O.match(
      () => E.right(x),
      (b) => E.left(b),
    ),
  ),
);

export default chainOptionElse;
