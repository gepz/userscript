import * as Op from '@fp-ts/optic';
import {
  Option as O,
  Array as A,
} from 'effect';
import {
  pipe,
} from 'effect/Function';
import {
  Refinement,
} from 'effect/Predicate';

type ElementOpticPair<S, A> = {
  ele: A,
  opt: Op.Optional<S, A>
};

export default ElementOpticPair;

export const make = <A>(ele: A) => <S>(
  opt: Op.Optional<S, A>,
): ElementOpticPair<S, A> => ({
  ele,
  opt,
});

export const of = <A>(ele: A): ElementOpticPair<A, A> => make(ele)(Op.id());

export const filter = <S, A, B extends A>(
  refinement: Refinement<A, B>,
) => (
  pair: ElementOpticPair<S, A>,
): O.Option<ElementOpticPair<S, B>> => pipe(
  pair.ele,
  O.liftPredicate(refinement),
  O.map((x) => ({
    ele: x,
    opt: pair.opt.filter(refinement),
  })),
);

export const prop = <A, P extends keyof A>(p: P) => <S>(
  pair: ElementOpticPair<S, A>,
): ElementOpticPair<S, A[P]> => ({
  ele: pair.ele[p],
  opt: pair.opt.at(p),
});

export const toArray = <S, A>(
  pair: ElementOpticPair<S, readonly A[]>,
): readonly ElementOpticPair<S, A>[] => pipe(
  pair.ele,
  A.map((e, i) => pipe(
    pair.opt.index(i),
    make(e),
  )),
);

export const some = <S, A>(
  pair: ElementOpticPair<S, O.Option<A>>,
): O.Option<ElementOpticPair<S, A>> => pipe(
  pair.ele,
  O.map((x) => ({
    ele: x,
    opt: pair.opt.some(),
  })),
);
