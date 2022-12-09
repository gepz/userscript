import * as O from 'fp-ts/Option';
import {
  Refinement,
} from 'fp-ts/Refinement';
import {
  pipe,
} from 'fp-ts/function';
import * as Op from 'monocle-ts/Optional';

export type ElementOpticPair<S, A> = {
  ele: A,
  opt: Op.Optional<S, A>
};

export const of = <A>(ele: A) => <S>(opt: Op.Optional<S, A>) => ({
  ele,
  opt,
});

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

export const prop = <A, P extends keyof A>(p: P) => <S>(
  pair: ElementOpticPair<S, A>,
): ElementOpticPair<S, A[P]> => ({
  ele: pair.ele[p],
  opt: pipe(
    pair.opt,
    Op.prop(p),
  ),
});
