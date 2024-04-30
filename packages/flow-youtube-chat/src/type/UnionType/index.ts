import {
  getMonoid,
} from '@effect/typeclass/Applicative';
import {
  Monoid,
  concatAll,
} from '@effect/typeclass/Monoid';
import {
  Semigroup,
} from '@effect/typeclass/Semigroup';
import {
  Either as E,
} from 'effect';
import {
  pipe,
  flow,
} from 'effect/Function';
import {
  Array as A,
} from 'effect';

import {
  ReadonlyRecord as RR,
} from 'effect';

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
  A.map(f),
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
  resolveUnion(getMonoid(
    E.Applicative,
  )<GenericMap, string>(
    RR.getUnionMonoid(semigroup),
  ))(flow(
    O.liftPredicate((s) => s.tag !== target.type.tag),
    O.map((s) => `Type ${s.tag} is not assignable to type ${target.type.tag}`),
  )),
);
