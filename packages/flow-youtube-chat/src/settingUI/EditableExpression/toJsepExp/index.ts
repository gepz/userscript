import * as expEval from 'expression-eval';
import * as O from 'fp-ts/Option';
import * as R from 'fp-ts/Reader';
import * as RA from 'fp-ts/ReadonlyArray';
import {
  constant,
  flow,
  identity,
  pipe,
} from 'fp-ts/function';

import ArrayExpression from '@/settingUI/EditableExpression/ArrayExpression';
import CallExpression from '@/settingUI/EditableExpression/CallExpression';
import Compound from '@/settingUI/EditableExpression/Compound';
import Expression from '@/settingUI/EditableExpression/Expression';
import Identifier from '@/settingUI/EditableExpression/Identifier';
import Literal from '@/settingUI/EditableExpression/Literal';
import LiteralArray from '@/settingUI/EditableExpression/LiteralArray';
import MemberExpression from '@/settingUI/EditableExpression/MemberExpression';
import * as Ed from '@/ui/Editable';

type JsepExpFunc = R.Reader<Expression, expEval.parse.Expression>;

const identifier: R.Reader<Identifier, expEval.parse.Identifier> = identity;

const memberExp = (
  f: JsepExpFunc,
) => (
  exp: MemberExpression,
): expEval.parse.MemberExpression => ({
  ...exp,
  object: f(exp.object),
  property: f(exp.property),
}
);

const callExp = (
  f: JsepExpFunc,
) => (
  exp: CallExpression,
): expEval.parse.CallExpression => ({
  ...exp,
  arguments: pipe(
    exp.argument,
    O.map(f),
    O.map(RA.of),
    O.map(RA.toArray),
    O.getOrElse(constant<expEval.parse.Expression[]>([])),
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
        raw: x,
      }),
    )),
    RA.toArray,
  ),
});

const arrayExp = (
  f: JsepExpFunc,
) => (
  exp: ArrayExpression,
): expEval.parse.ArrayExpression => pipe(
  {
    type: exp.type,
    elements: pipe(
      RA.map(f)(exp.elements),
      RA.toArray,
    ),
  },
);

const compound = (
  f: JsepExpFunc,
) => (
  exp: Compound,
): expEval.parse.Compound => pipe(
  {
    type: exp.type,
    body: pipe(
      RA.map(f)(exp.body),
      RA.toArray,
    ),
  },
);

const toJsepExp: JsepExpFunc = (
  x,
) => (x.type === 'Identifier' ? identifier(x)
: x.type === 'ArrayExpression' ? arrayExp(toJsepExp)(x)
: x.type === 'MemberExpression' ? memberExp(toJsepExp)(x)
: x.type === 'CallExpression' ? callExp(toJsepExp)(x)
: x.type === 'Literal' ? literal(x)
: x.type === 'LiteralArray' ? literalArray(x)
: compound(toJsepExp)(x));

export default toJsepExp;
