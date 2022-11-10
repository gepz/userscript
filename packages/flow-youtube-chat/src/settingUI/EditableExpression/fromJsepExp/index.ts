import * as expEval from 'expression-eval';
import * as O from 'fp-ts/Option';
import * as R from 'fp-ts/Reader';
import * as RA from 'fp-ts/ReadonlyArray';
import {
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

type ExpFunc = R.Reader<expEval.parse.Expression, O.Option<Expression>>;

const identifier: R.Reader<expEval.parse.Identifier, Identifier> = identity;

const memberExp = (
  f: ExpFunc,
) => (
  exp: expEval.parse.MemberExpression,
): O.Option<MemberExpression> => pipe(
  {
    type: exp.type,
    computed: exp.computed,
  },
  O.of,
  O.bind('object', () => f(exp.object)),
  O.bind('property', () => f(exp.property)),
);

const callExp = (
  f: ExpFunc,
) => (
  exp: expEval.parse.CallExpression,
): O.Option<CallExpression> => pipe(
  {
    type: exp.type,
  },
  O.of,
  O.bind('argument', () => pipe(
    exp.arguments,
    RA.head,
    O.map(f),
  )),
  O.bind('callee', () => f(exp.callee)),
);

const literal = (
  exp: expEval.parse.Literal,
): O.Option<Literal> => (typeof exp.value === 'string' ? O.of({
  type: 'Literal',
  value: Ed.of(exp.value),
}) : O.none);

const arrayExp = (
  f: ExpFunc,
) => (
  exp: expEval.parse.ArrayExpression,
): O.Option<ArrayExpression> | O.Option<LiteralArray> => pipe(
  exp.elements,
  (elements) => pipe(
    elements,
    O.fromPredicate(RA.every((
      x,
    ): x is expEval.parse.Literal => x.type === 'Literal')),
    O.filter(RA.every((
      x,
    ): x is {
      type: 'Literal';
      value: string;
      raw: string;
    } => typeof x.value === 'string')),
    O.map((es): LiteralArray => ({
      type: 'LiteralArray',
      value: Ed.of(pipe(
        es,
        RA.map((x) => x.value),
      )),
    })),
    (x) => (O.isSome(x) ? x : pipe(
      {
        type: exp.type,
      },
      O.of,
      O.bind('elements', () => pipe(
        elements,
        RA.map(f),
        O.sequenceArray,
      )),
    )),
  ),
);

const compound = (
  f: ExpFunc,
) => (
  exp: expEval.parse.Compound,
): O.Option<Compound> => pipe(
  {
    type: exp.type,
  },
  O.of,
  O.bind('body', () => pipe(
    exp.body,
    RA.map(f),
    O.sequenceArray,
  )),
);

type expType = {
  Identifier: expEval.parse.Identifier,
  MemberExpression: expEval.parse.MemberExpression,
  CallExpression: expEval.parse.CallExpression,
  Literal: expEval.parse.Literal,
  ArrayExpression: expEval.parse.ArrayExpression,
  Compound: expEval.parse.Compound,
};

const isExpType = <T extends keyof expType>(
  type: T,
) => (
  x: expEval.parse.Expression,
): x is expType[T] => x.type === type;

const fromJsepExp: ExpFunc = (
  x,
) => (isExpType('Identifier')(x) ? O.of(identifier(x))
: isExpType('MemberExpression')(x) ? memberExp(fromJsepExp)(x)
: isExpType('CallExpression')(x) ? callExp(fromJsepExp)(x)
: isExpType('Literal')(x) ? literal(x)
: isExpType('ArrayExpression')(x) ? arrayExp(fromJsepExp)(x)
: isExpType('Compound')(x) ? compound(fromJsepExp)(x)
: O.none);

export default fromJsepExp;
