import {
  first,
} from '@effect/typeclass/Semigroup';
import {
  pipe,
  flow,
} from 'effect/Function';
import * as O from 'effect/Option';

import TaggedValue, {
  makeType,
} from '@/TaggedValue';
import AssignGenericFunction from '@/type/AssignGenericFunction';
import GenericMap, {
  resolveGeneric,
} from '@/type/GenericMap';
import Primitive from '@/type/Primitive';
import type Type from '@/type/Type';
import TypeWithMap from '@/type/TypeWithMap';
import UI from '@/type/UI';
import {
  resolveUnion,
} from '@/type/UnionType';

type SimpleType = TaggedValue<'simple', {
  pri: Primitive,
  ui: UI,
}>;

export default SimpleType;

export const of = makeType<SimpleType>('simple');

export const fromPrimitive = (
  pri: Primitive,
) => of({
  pri,
  ui: UI.unknown,
});

export const assignGeneric = (
  f: AssignGenericFunction<Type>,
): AssignGenericFunction<SimpleType> => (
  typeMap,
) => (
  expected,
) => (
  synthed,
) => pipe();

export const checkAssignability = (
  target: SimpleType,
): R.Reader<TypeWithMap, O.Option<string>> => flow(
  resolveGeneric,
  ({
    type,
  }) => type,
  resolveUnion(O.getMonoid(first<string>()))((s) => (s.tag === target.tag
    ? s.value.pri === target.value.pri
      ? O.none()
      : O.some('The types of the two primitives are different.')
    : O.some(`Type ${s.tag} is not assignable to type ${target.tag}`))),
);

