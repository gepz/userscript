import {
  tapNonNull,
} from '@userscript/tap';
import * as E from 'effect/Either';
import * as N from 'effect/Number';
import * as O from 'effect/Option';
import * as RA from 'effect/ReadonlyArray';
import * as RR from 'effect/ReadonlyRecord';
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
    RA.reduceWithIndex<
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
    }, targetType) => (RA.isEmpty(sourceMatches) ? SEP.separated(failures, [])
    : pipe(
      sourceMatches,
      targetType.tag === 'rest' ? flow(
        RA.flatMap((match) => pipe(
          RA.unfold<E.Either<string, {
            index: number,
            lowerBound: GenericMap,
          }>, O.Option<{
            index: number,
            lowerBound: GenericMap,
          }>>(
            O.some(match),
            flow(
              O.map((currentMatch) => pipe(
                RA.lookup(currentMatch.index)(source.value),
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
          RA.prepend(E.right(match)),
        )),
      ) : flow(
        RA.map((match) => pipe(
          RA.lookup(match.index)(source.value),
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
      RA.separate,
      SEP.map((()),
      SEP.map(RA.uniq(N.Ord)),
    ))),
    (result) => pipe(
      result.right,
      RA.map(E.liftPredicate(
        (x) => x >= source.value.length,
        () => 'Source has too many elements',
      )),
      RA.separate,
      (x) => SEP.separated(RA.isEmpty(x.left) ? result.left : x.left, x.right),
    ),
    O.liftPredicate((x) => RA.isEmpty(x.right)),
    O.map((x) => x.left[0]),
    O.map((x) => tapNonNull(x, 'Defect: Nothing is in the result')),
  ) : O.some(`Type ${source.tag} is not assignable to type ${target.tag}`))),
);
