import {
  first,
} from '@effect/typeclass/Semigroup';
import {
  flow,
  pipe,
} from 'effect/Function';
import * as O from 'effect/Option';

import AssignGenericFunction from '@/type/AssignGenericFunction';
import GenericMap, {
  resolveGeneric,
} from '@/type/GenericMap';
import type Type from '@/type/Type';
import TypeWithMap from '@/type/TypeWithMap';
import {
  resolveUnion,
} from '@/type/UnionType';

type UnitType = {
  tag: 'unit',
};

export default UnitType;

export const unit: UnitType = {
  tag: 'unit',
};

export const assignGeneric = (
  f: AssignGenericFunction<Type>,
): AssignGenericFunction<UnitType> => (
  typeMap,
) => (
  expected,
) => (
  synthed,
) => pipe();

export const checkAssignability = (
  target: UnitType,
): R.Reader<TypeWithMap, O.Option<string>> => flow(
  resolveGeneric,
  ({
    type,
  }) => type,
  resolveUnion(O.getMonoid(first<string>()))(flow(
    O.liftPredicate((s) => s.tag !== target.tag),
    O.map((s) => `Type ${s.tag} is not assignable to type ${target.tag}`),
  )),
);

