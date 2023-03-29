import * as I from '@effect/data/Identity';
import {
  pipe,
} from '@effect/data/Function';

import type DotMemberAccess from '@/restrictedExpression/DotMemberAccess';
import TaggedValue, {
  makeType,
} from '@/TaggedValue';
import TypeBase from '@/typedExpression/TypeBase';
import type TypedExpression from '@/typedExpression/typedExpression';
import TypedExpressionFunction from '@/typedExpression/typedExpressionFunction';
import Type from '@/type/Type';
import * as unknownType from '@/type/UnknownType';

type TypedDotMember = TaggedValue<'typedDotMember', TypeBase & {
  object: TypedExpression;
  property: string;
}>;

export const of = makeType<TypedDotMember>('typedDotMember');

export const fromExp = ({
  value,
}: DotMemberAccess) => (
  f: TypedExpressionFunction,
) => ({
  expected,
}: { expected: Type }): TypedDotMember => pipe(
  {
    object: f(value.object)(expected),
    expected,
    property: value.property,
  },
  I.bind('synthed', (c) => pipe(
    c.object.value.synthed,
    (x) => (x.tag === 'record' && value.property in x.value
      ? x.value[value.property]
      : unknownType.unknown),
  )),
  of,
);

export default TypedDotMember;
