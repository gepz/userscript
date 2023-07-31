import {
  pipe,
  flow,
} from 'effect/Function';
import * as RA from 'effect/ReadonlyArray';
import {
  getApplicativeMonoid,
} from 'fp-ts/Applicative';
import * as E from 'effect/Either';
import {
  Monoid,
  concatAll,
} from 'fp-ts/Monoid';
import * as RR from 'fp-ts/ReadonlyRecord';
import {
  Semigroup,
} from 'fp-ts/Semigroup';

import TaggedValue, {
  makeType,
} from '@/TaggedValue';
import AssignGenericFunction from '@/type/AssignGenericFunction';
import GenericMap, {
  resolveGeneric,
} from '@/type/GenericMap';
import TargetLowerBoundFunc from '@/type/TargetLowerBoundFunc';
import type Type from '@/type/Type';

type UnionType = TaggedValue<
'union',
readonly Exclude<Type, UnionType>[]
>;

export default UnionType;

export const of = makeType<UnionType>('union');

export const never = of([]);

export const assignGeneric = (
  f: AssignGenericFunction<Type>,
): AssignGenericFunction<UnionType> => (
  typeMap,
) => (
  expected,
) => (
  synthed,
) => pipe();

export const resolveUnion = <T>(
  m: Monoid<T>,
) => (
  f: (x: Exclude<Type, UnionType>) => T,
) => (x: Type): T => (x.tag === 'union' ? pipe(
  x.value,
  RA.map(f),
  concatAll(m),
) : f(x));

export const targetLowerBound = (
  semigroup: Semigroup<Type>,
) => (
  f: TargetLowerBoundFunc<Type>,
): TargetLowerBoundFunc<UnionType> => (
  target,
) => flow(
  resolveGeneric,
  resolveUnion(getApplicativeMonoid(
    E.Applicative,
  )<GenericMap, string>(
    RR.getUnionMonoid(semigroup),
  ))(flow(
    O.liftPredicate((s) => s.tag !== target.type.tag),
    O.map((s) => `Type ${s.tag} is not assignable to type ${target.type.tag}`),
  )),
);
