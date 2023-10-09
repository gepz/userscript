import {
  bind,
} from '@effect/typeclass/Chainable';
import * as I from '@effect/typeclass/data/Identity';
import {
  pipe,
} from 'effect/Function';
import * as O from 'effect/Option';

import TaggedValue, {
  makeType,
} from '@/TaggedValue';
import type CallExpression from '@/restrictedExpression/CallExpression';
import * as functionType from '@/type/FunctionType';
import Type from '@/type/Type';
import * as unknownType from '@/type/UnknownType';
import TypeBase from '@/typedExpression/TypeBase';
import TypedExpressionFunction from '@/typedExpression/TypedExpressionFunction';
import type TypedExpression from '@/typedExpression/typedExpression';

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
  bind(I.Chainable)('argument', (c) => pipe(
    value.argument,
    O.map((arg) => pipe(
      c.callee.value.synthed,
      (x) => (x.tag === 'func' ? functionType.firstParamOf(x).type
      : unknownType.unknown),
      (x) => f(arg)(x),
    )),
  )),
  bind(I.Chainable)('synthed', (c) => pipe(
    c.callee.value.synthed,
    (x) => (x.tag === 'func' ? functionType.returnOf(x)
    : unknownType.unknown),
  )),
  (x) => x,
  of,
);

export default TypedCall;
