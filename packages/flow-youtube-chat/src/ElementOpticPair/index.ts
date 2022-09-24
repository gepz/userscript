import * as O from 'fp-ts/Option';
import {
  Refinement,
} from 'fp-ts/Refinement';
import {
  pipe,
} from 'fp-ts/function';
import * as Op from 'monocle-ts/Optional';

export type ElementOpticPair<T1, T2> = {
  ele: T2,
  opt: Op.Optional<T1, T2>
};

export const filter = <S, A, B extends A>(
  refinement: Refinement<A, B>,
) => (
  pair: ElementOpticPair<S, A>,
): O.Option<ElementOpticPair<S, B>> => pipe(
  pair.ele,
  O.fromPredicate(refinement),
  O.map((x) => ({
    ele: x,
    opt: pipe(
      pair.opt,
      Op.filter(refinement),
    ),
  })),
);
