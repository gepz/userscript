import * as E from 'effect/Either';
import {
  pipe,
} from 'effect/Function';
import * as O from 'effect/Option';
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
): E.Either<string, CallExpression> => pipe(
  exp.arguments,
  E.liftPredicate(
    (x): x is [expEval.parse.Expression] | [] => x.length <= 1,
    () => 'A function call cannot take more than 1 arguments',
  ),
  E.map(RA.head),
  E.map(O.map(f)),
  E.flatMap(O.sequence(E.Applicative)),
  E.bindTo('argument'),
  E.apS('callee', f(exp.callee)),
  E.map(of),
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
    RA.fromOption,
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
