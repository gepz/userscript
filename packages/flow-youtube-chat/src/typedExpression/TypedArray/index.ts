import {
  bind,
} from '@effect/typeclass/Chainable';
import * as I from '@effect/typeclass/data/Identity';
import {
  pipe,
} from 'effect/Function';
import * as A from 'effect/Array';

import TaggedValue, {
  makeType,
} from '@/TaggedValue';
import type ArrayLiteral from '@/restrictedExpression/ArrayLiteral';
import * as tupleType from '@/type/TupleType';
import Type from '@/type/Type';
import TypeBase from '@/typedExpression/TypeBase';
import TypedExpressionFunction from '@/typedExpression/TypedExpressionFunction';
import type TypedExpression from '@/typedExpression/typedExpression';

type TypedArray = TaggedValue<'typedArray', TypeBase & {
  elements: readonly TypedExpression[];
}>;

export const of = makeType<TypedArray>('typedArray');

export const fromExp = ({
  value,
}: ArrayLiteral) => (
  f: TypedExpressionFunction,
) => ({
  expected,
}: { expected: Type }): TypedArray => pipe(
  value.elements,
  A.map((x) => f(x)(expected)),
  (elements) => ({
    elements,
  }),
  bind(I.Chainable)('expected', () => expected),
  (ctx) => bind(I.Chainable)(ctx, 'synthed', (c) => tupleType.of(pipe(
    c.elements,
    A.map((x) => x.value.synthed),
  ))),
  of,
);

export default TypedArray;
