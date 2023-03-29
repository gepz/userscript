import {
  pipe,
} from '@effect/data/Function';
import * as RA from '@effect/data/ReadonlyArray';
import * as I from '@effect/data/Identity';

import type ArrayLiteral from '@/restrictedExpression/ArrayLiteral';
import TaggedValue, {
  makeType,
} from '@/TaggedValue';
import TypeBase from '@/typedExpression/TypeBase';
import type TypedExpression from '@/typedExpression/typedExpression';
import TypedExpressionFunction from '@/typedExpression/typedExpressionFunction';
import * as tupleType from '@/type/TupleType';
import Type from '@/type/Type';

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
  RA.map((x) => f(x)(expected)),
  I.bindTo('elements'),
  I.apS('expected', expected),
  I.bind('synthed', (c) => tupleType.of(pipe(
    c.elements,
    RA.map((x) => x.value.synthed),
  ))),
  of,
);

export default TypedArray;
