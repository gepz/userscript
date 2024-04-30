import * as Ed from '@userscript/ui/Editable';
import {
  identity,
  pipe,
} from 'effect/Function';
import {
  Option as O,
} from 'effect';

import {
  Array as A,
} from 'effect';

import * as expEval from 'expression-eval';

// eslint-disable-next-line max-len
import type ArrayExpression from '@/settingUI/editableExpression/ArrayExpression';
import CallExpression from '@/settingUI/editableExpression/CallExpression';
import type Compound from '@/settingUI/editableExpression/Compound';
import type Identifier from '@/settingUI/editableExpression/Identifier';
import type Literal from '@/settingUI/editableExpression/Literal';
import LiteralArray from '@/settingUI/editableExpression/LiteralArray';
// eslint-disable-next-line max-len
import type MemberExpression from '@/settingUI/editableExpression/MemberExpression';

type Expression = ArrayExpression
| CallExpression
| Identifier
| Literal
| LiteralArray
| MemberExpression
| Compound;

export default Expression;

type ExpressionFunctoin = (
  exp: expEval.parse.Expression
) => O.Option<Expression>;

const identifier: (id: expEval.parse.Identifier) => Identifier = identity;

const memberExp = (
  f: ExpressionFunctoin,
) => (
  exp: expEval.parse.MemberExpression,
): O.Option<MemberExpression> => pipe(
  {
    type: exp.type,
    computed: exp.computed,
  },
  O.some,
  O.bind('object', () => f(exp.object)),
  O.bind('property', () => pipe(
    f(exp.property),
    O.filter((x): x is Exclude<
    Expression, ArrayExpression | LiteralArray
    > => x.type !== 'ArrayExpression' && x.type !== 'LiteralArray'),
  )),
);

const callExp = (
  f: ExpressionFunctoin,
) => (
  exp: expEval.parse.CallExpression,
): O.Option<CallExpression> => pipe(
  {
    type: exp.type,
  },
  O.some,
  O.bind('argument', () => pipe(
    exp.arguments,
    A.head,
    O.map(f),
  )),
  O.bind('callee', () => f(exp.callee)),
);

const literal = (
  exp: expEval.parse.Literal,
): O.Option<Literal> => (typeof exp.value === 'string' ? O.some({
  type: 'Literal',
  value: Ed.of(exp.value),
}) : O.none());

const arrayExp = (
  f: ExpressionFunctoin,
) => (
  exp: expEval.parse.ArrayExpression,
): O.Option<ArrayExpression> | O.Option<LiteralArray> => pipe(
  exp.elements,
  (elements) => pipe(
    elements,
    O.liftPredicate(A.every((
      x,
    ): x is expEval.parse.Literal => x.type === 'Literal')),
    O.filter(A.every((
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
        A.map((x) => x.value),
      )),
    })),
    (x) => (O.isSome(x) ? x : pipe(
      {
        type: exp.type,
      },
      O.some,
      O.bind('elements', () => pipe(
        elements,
        A.map(f),
        O.sequenceArray,
      )),
    )),
  ),
);

const compound = (
  f: ExpressionFunctoin,
) => (
  exp: expEval.parse.Compound,
): O.Option<Compound> => pipe(
  {
    type: exp.type,
  },
  O.some,
  O.bind('body', () => pipe(
    exp.body,
    A.map(f),
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

export const fromJsepExp: ExpressionFunctoin = (
  x,
) => (isExpType('Identifier')(x) ? O.some(identifier(x))
: isExpType('MemberExpression')(x) ? memberExp(fromJsepExp)(x)
: isExpType('CallExpression')(x) ? callExp(fromJsepExp)(x)
: isExpType('Literal')(x) ? literal(x)
: isExpType('ArrayExpression')(x) ? arrayExp(fromJsepExp)(x)
: isExpType('Compound')(x) ? compound(fromJsepExp)(x)
: O.none());
