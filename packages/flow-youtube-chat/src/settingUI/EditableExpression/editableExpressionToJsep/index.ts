import {
  constant,
  flow,
  identity,
  pipe,
} from 'effect/Function';
import * as O from 'effect/Option';
import * as RA from 'effect/ReadonlyArray';
import * as expEval from 'expression-eval';

import ArrayExpression from '@/settingUI/editableExpression/ArrayExpression';
import CallExpression from '@/settingUI/editableExpression/CallExpression';
import Compound from '@/settingUI/editableExpression/Compound';
import Expression from '@/settingUI/editableExpression/Expression';
import Identifier from '@/settingUI/editableExpression/Identifier';
import Literal from '@/settingUI/editableExpression/Literal';
import LiteralArray from '@/settingUI/editableExpression/LiteralArray';
import MemberExpression from '@/settingUI/editableExpression/MemberExpression';
import * as Ed from '@userscript/ui/Editable';

type JsepExpressionFunction = (x: Expression) => expEval.parse.Expression;

const identifier: (x: Identifier) => expEval.parse.Identifier = identity;

const memberExp = (
  f: JsepExpressionFunction,
) => (
  exp: MemberExpression,
): expEval.parse.MemberExpression => ({
  ...exp,
  object: f(exp.object),
  property: f(exp.property),
}
);

const callExp = (
  f: JsepExpressionFunction,
) => (
  exp: CallExpression,
): expEval.parse.CallExpression => ({
  ...exp,
  arguments: pipe(
    exp.argument,
    O.map(f),
    O.map(RA.of),
    O.getOrElse<expEval.parse.Expression[]>(constant([])),
  ),
  callee: f(exp.callee),
}
);

const literal = (
  exp: Literal,
): expEval.parse.Literal => pipe(
  exp.value,
  Ed.value,
  (x) => ({
    type: 'Literal',
    value: x,
    raw: JSON.stringify(x),
  }),
);

const literalArray = (
  exp: LiteralArray,
): expEval.parse.ArrayExpression => ({
  type: 'ArrayExpression',
  elements: pipe(
    exp.value,
    Ed.value,
    RA.map(flow(
      (x): expEval.parse.Literal => ({
        type: 'Literal',
        value: x,
        raw: JSON.stringify(x),
      }),
    )),
  ),
});

const arrayExp = (
  f: JsepExpressionFunction,
) => (
  exp: ArrayExpression,
): expEval.parse.ArrayExpression => pipe(
  {
    type: exp.type,
    elements: pipe(
      RA.map(f)(exp.elements),
    ),
  },
);

const compound = (
  f: JsepExpressionFunction,
) => (
  exp: Compound,
): expEval.parse.Compound => pipe(
  {
    type: exp.type,
    body: RA.map(f)(exp.body),
  },
);

const editableExpressionToJsep: JsepExpressionFunction = (
  x,
) => (x.type === 'Identifier' ? identifier(x)
: x.type === 'ArrayExpression' ? arrayExp(editableExpressionToJsep)(x)
: x.type === 'MemberExpression' ? memberExp(editableExpressionToJsep)(x)
: x.type === 'CallExpression' ? callExp(editableExpressionToJsep)(x)
: x.type === 'Literal' ? literal(x)
: x.type === 'LiteralArray' ? literalArray(x)
: compound(editableExpressionToJsep)(x));

export default editableExpressionToJsep;

