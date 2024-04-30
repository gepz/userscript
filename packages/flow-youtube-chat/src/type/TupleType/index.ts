import {
  tapNonNull,
} from '@userscript/tap';
import {
  Either as E,
} from 'effect';
import {
  Number as N,
} from 'effect';
import {
  Option as O,
} from 'effect';
import {
  Array as A,
} from 'effect';

import {
  ReadonlyRecord as RR,
} from 'effect';
import * as SEP from 'fp-ts/Separated';
import {
  pipe,
  flow,
} from 'effect/Function';

import TaggedValue, {
  makeType,
} from '@/TaggedValue';
import AssignGenericFunction from '@/type/AssignGenericFunction';
import GenericMap, {
  resolveGeneric,
} from '@/type/GenericMap';
import RestType from '@/type/RestType';
import * as restType from '@/type/RestType';
import TargetLowerBoundFunc from '@/type/TargetLowerBoundFunc';
import type Type from '@/type/Type';

type TupleType = TaggedValue<'tuple', readonly (Type | RestType)[]>;

export default TupleType;

export const of = makeType<TupleType>('tuple');

export const list = (x: Type) => of([restType.of(x)]);

export const assignGeneric = (
  f: AssignGenericFunction<Type>,
): AssignGenericFunction<TupleType> => (
  typeMap,
) => (
  expected,
) => (
  synthed,
) => pipe();

export const targetLowerBound = (
  f: TargetLowerBoundFunc<Type>,
): TargetLowerBoundFunc<TupleType> => (
  targetConstraint,
) => (
  target,
) => flow(
  resolveGeneric,
  R.map(({
    type: source,
    map: sourceConstraint,
  }) => (source.tag === target.tag ? pipe(
    target.value,
    A.reduceWithIndex<
    Type | RestType,
    SEP.Separated<readonly string[], readonly {
      index: number,
      lowerBound: GenericMap,
    }[]>
    >(SEP.separated([], [{
      index: 0,
      lowerBound: {},
    }]), (indexA, {
      left: failures,
      right: sourceMatches,
    }, targetType) => (A.isEmpty(sourceMatches) ? SEP.separated(failures, [])
    : pipe(
      sourceMatches,
      targetType.tag === 'rest' ? flow(
        A.flatMap((match) => pipe(
          A.unfold<E.Either<string, {
            index: number,
            lowerBound: GenericMap,
          }>, O.Option<{
            index: number,
            lowerBound: GenericMap,
          }>>(
            O.some(match),
            flow(
              O.map((currentMatch) => pipe(
                A.lookup(currentMatch.index)(source.value),
                E.fromOption(() => 'Source has too few elements'),
                E.map((x) => f(targetConstraint)(targetType.value)(
                  sourceConstraint,
                )(x.tag === 'rest' ? x.value : x)),
                E.flatMap(E.map((x) => ({
                  index: currentMatch.index + 1,
                  lowerBound: RR.intersection()(x)(match.lowerBound),
                }))),
                (element) => [
                  element,
                  pipe(
                    element,
                    O.fromEither,
                  ),
                ] as const,
              )),
            ),
          ),
          A.prepend(E.right(match)),
        )),
      ) : flow(
        A.map((match) => pipe(
          A.lookup(match.index)(source.value),
          E.fromOption(() => 'Source has too few elements'),
          E.filterOrElse(
            (x): x is Type => x.tag !== 'rest',
            () => 'Rest element type is not assignable to non-rest type',
          ),
          E.map(f(targetConstraint)(targetType)(sourceConstraint)),
          E.flatMap(E.map((x) => ({
            index: match.index + 1,
            lowerBound: x,
          }))),
        )),
      ),
      A.separate,
      SEP.map((()),
      SEP.map(A.uniq(N.Ord)),
    ))),
    (result) => pipe(
      result.right,
      A.map(E.liftPredicate(
        (x) => x >= source.value.length,
        () => 'Source has too many elements',
      )),
      A.separate,
      (x) => SEP.separated(A.isEmpty(x.left) ? result.left : x.left, x.right),
    ),
    O.liftPredicate((x) => A.isEmpty(x.right)),
    O.map((x) => x.left[0]),
    O.map((x) => tapNonNull(x, 'Defect: Nothing is in the result')),
  ) : O.some(`Type ${source.tag} is not assignable to type ${target.tag}`))),
);
