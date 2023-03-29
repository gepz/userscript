import {
  pipe,
} from '@effect/data/Function';
import * as I from '@effect/data/Identity';
import * as O from '@effect/data/Option';

import type CallExpression from '@/restrictedExpression/CallExpression';
import TaggedValue, {
  makeType,
} from '@/TaggedValue';
import TypeBase from '@/typedExpression/TypeBase';
import type TypedExpression from '@/typedExpression/typedExpression';
import TypedExpressionFunction from '@/typedExpression/typedExpressionFunction';
import * as functionType from '@/type/FunctionType';
import Type from '@/type/Type';
import * as unknownType from '@/type/UnknownType';

type TypedCall = TaggedValue<'typedCall', TypeBase & {
  argument: O.Option<TypedExpression>;
  callee: TypedExpression;
}>;

export const of = makeType<TypedCall>('typedCall');

export const fromExp = ({
  value,
}: CallExpression) => (
  f: TypedExpressionFunction,
) => ({
  expected,
}: { expected: Type }): TypedCall => pipe(
  {
    callee: f(value.callee)(functionType.fromParamAndReturn(
      unknownType.unknown,
    )(expected)),
    expected,
  },
  I.bind('argument', (c) => pipe(
    value.argument,
    O.map((arg) => pipe(
      c.callee.value.synthed,
      (x) => (x.tag === 'func' ? functionType.firstParamOf(x).type
      : unknownType.unknown),
      (x) => f(arg)(x),
    )),
  )),
  I.bind('synthed', (c) => pipe(
    c.callee.value.synthed,
    (x) => (x.tag === 'func' ? functionType.returnOf(x)
    : unknownType.unknown),
  )),
  of,
);

export default TypedCall;
