import {
  Effect as Z,
  pipe,
  Option as O,
  Array as A,
} from 'effect';

import * as expEval from 'expression-eval';

import TaggedValue, {
  makeType,
} from '@/TaggedValue';
import type Expression from '@/restrictedExpression/Expression';
import ExpressionFromJsExp from '@/restrictedExpression/ExpressionFromJsExp';
// eslint-disable-next-line max-len
import ExpressionFromTypedExp from '@/restrictedExpression/ExpressionFromTypedExp';
import JsExpFromExpression from '@/restrictedExpression/JsExpFromExpression';
import TypedCall from '@/typedExpression/TypedCall';

type CallExpression = TaggedValue<'callExpression', {
  argument: O.Option<Expression>;
  callee: Expression;
}>;

export const of = makeType<CallExpression>('callExpression');

export const fromJsExp = (
  exp: expEval.parse.CallExpression,
) => (
  f: ExpressionFromJsExp,
): Z.Effect<CallExpression, string> => pipe(
  exp.arguments,
  Z.succeed,
  Z.filterOrFail(
    (x): x is [expEval.parse.Expression] | [] => x.length <= 1,
    () => 'A function call cannot take more than 1 arguments',
  ),
  Z.map(A.head),
  Z.map(O.map(f)),
  Z.flatMap(O.match({
    onNone: () => Z.succeed(O.none()),
    onSome: Z.map((x) => O.some(x)),
  })),
  Z.bindTo('argument'),
  Z.bind('callee', () => f(exp.callee)),
  Z.map(of),
);

export const toJsExp = ({
  value,
}: CallExpression) => (
  f: JsExpFromExpression,
): expEval.parse.CallExpression => ({
  type: 'CallExpression',
  arguments: pipe(
    value.argument,
    O.map(f),
    A.fromOption,
  ),
  callee: f(value.callee),
}
);

export const fromTypedExp = ({
  value,
}: TypedCall) => (
  f: ExpressionFromTypedExp,
): CallExpression => pipe(
  {
    argument: pipe(
      value.argument,
      O.map(f),
    ),
    callee: f(value.callee),
  },
  of,
);

export default CallExpression;
