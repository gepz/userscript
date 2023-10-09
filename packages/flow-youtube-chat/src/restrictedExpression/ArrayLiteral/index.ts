import * as Z from 'effect/Effect';
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
): Z.Effect<never, string, ArrayLiteral> => pipe(
  exp.elements,
  RA.map(f),
  (x) => x,
  Z.all,
  Z.bindTo('elements'),
  Z.map(of),
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
