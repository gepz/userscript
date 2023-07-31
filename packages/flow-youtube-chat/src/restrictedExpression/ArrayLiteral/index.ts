import * as E from 'effect/Either';
import {
  pipe,
} from 'effect/Function';
import * as RA from 'effect/ReadonlyArray';
import * as expEval from 'expression-eval';

import TaggedValue, {
  makeType,
} from '@/TaggedValue';
import type Expression from '@/restrictedExpression/Expression';
import ExpressionFromJsExp from '@/restrictedExpression/ExpressionFromJsExp';
// eslint-disable-next-line max-len
import ExpressionFromTypedExp from '@/restrictedExpression/ExpressionFromTypedExp';
import JsExpFromExpression from '@/restrictedExpression/JsExpFromExpression';
import TypedArray from '@/typedExpression/TypedArray';

type ArrayLiteral = TaggedValue<'arrayLiteral', {
  elements: readonly Expression[];
}>;

export const of = makeType<ArrayLiteral>('arrayLiteral');

export const fromJsExp = (
  exp: expEval.parse.ArrayExpression,
) => (
  f: ExpressionFromJsExp,
): E.Either<string, ArrayLiteral> => pipe(
  exp.elements,
  RA.map(f),
  E.sequenceArray,
  E.bindTo('elements'),
  E.map(of),
);

export const toJsExp = ({
  value,
}: ArrayLiteral) => (
  f: JsExpFromExpression,
): expEval.parse.ArrayExpression => pipe({
  type: 'ArrayExpression',
  elements: RA.map(f)(value.elements),
});

export const fromTypedExp = ({
  value,
}: TypedArray) => (
  f: ExpressionFromTypedExp,
): ArrayLiteral => pipe(
  {
    elements: RA.map(f)(value.elements),
  },
  of,
);

export default ArrayLiteral;
