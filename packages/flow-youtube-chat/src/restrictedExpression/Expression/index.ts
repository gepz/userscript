import * as expEval from 'expression-eval';
import * as E from 'effect/Either';
import * as R from 'fp-ts/Reader';
import {
  flow,
  pipe,
} from 'effect/Function';

// eslint-disable-next-line max-len
import ArrayLiteral, * as arrayLiteral from '@/restrictedExpression/ArrayLiteral';
import * as booleanLiteral from '@/restrictedExpression/BooleanLiteral';
// eslint-disable-next-line max-len
import CallExpression, * as callExpression from '@/restrictedExpression/CallExpression';
// eslint-disable-next-line max-len
import DotMemberAccess, * as dotMemberAccess from '@/restrictedExpression/DotMemberAccess';
import ExpressionFromJsExp from '@/restrictedExpression/ExpressionFromJsExp';
// eslint-disable-next-line max-len
import ExpressionFromTypedExp from '@/restrictedExpression/ExpressionFromTypedExp';
import Identifier, * as identifier from '@/restrictedExpression/Identifier';
import JsExpFromExpression from '@/restrictedExpression/JsExpFromExpression';
import * as numberLiteral from '@/restrictedExpression/NumberLiteral';
// eslint-disable-next-line max-len
import PrimitiveLiteral, * as primitiveLiteral from '@/restrictedExpression/PrimitiveLiteral';
import * as stringLiteral from '@/restrictedExpression/StringLiteral';
import TypedExpression from '@/typedExpression/typedExpression';
import chainFilterMapElse from '@/chainFilterMapElse';
import chainTagged from '@/chainTagged';
import processWithEither from '@/processWithEither';

type Expression = CallExpression
| Identifier
| ArrayLiteral
| PrimitiveLiteral
| DotMemberAccess;

export default Expression;

type jsExpType = {
  Identifier: expEval.parse.Identifier,
  MemberExpression: expEval.parse.MemberExpression,
  CallExpression: expEval.parse.CallExpression,
  Literal: expEval.parse.Literal,
  ArrayExpression: expEval.parse.ArrayExpression,
  Compound: expEval.parse.Compound,
};

const isJsExp = <T extends keyof jsExpType>(
  type: T,
) => (
  x: expEval.parse.Expression,
): x is jsExpType[T] => x.type === type;

export const fromJsExp: ExpressionFromJsExp = processWithEither(flow(
  chainFilterMapElse(isJsExp('MemberExpression'))(dotMemberAccess.fromJsExp),
  chainFilterMapElse(isJsExp('CallExpression'))(callExpression.fromJsExp),
  chainFilterMapElse(isJsExp('ArrayExpression'))(arrayLiteral.fromJsExp),
  E.mapLeft((x) => x(fromJsExp)),
  chainFilterMapElse(isJsExp('Identifier'))(pipe(
    identifier.fromJsExp,
    R.map(E.right),
  )),
  chainFilterMapElse(isJsExp('Literal'))(pipe(
    primitiveLiteral.fromJsExp,
    R.map(E.right),
  )),
  E.map((x) => E.left(`${x.type} expression type is not supported.`)),
));

export const toJsExp: JsExpFromExpression = (
  x,
) => (x.tag === 'identifier' ? identifier.toJsExp(x)
: x.tag === 'arrayLiteral' ? arrayLiteral.toJsExp(x)(toJsExp)
: x.tag === 'dotMemberAccess' ? dotMemberAccess.toJsExp(x)(toJsExp)
: x.tag === 'callExpression' ? callExpression.toJsExp(x)(toJsExp)
: primitiveLiteral.toJsep(x));

export const chainTyped = chainTagged<TypedExpression>('tag');

export const fromTypedExp: ExpressionFromTypedExp = processWithEither(flow(
  chainTyped(arrayLiteral.fromTypedExp)('typedArray'),
  chainTyped(dotMemberAccess.fromTypedExp)('typedDotMember'),
  chainTyped(callExpression.fromTypedExp)('typedCall'),
  E.mapLeft((x) => x(fromTypedExp)),
  chainTyped(identifier.fromTypedExp)('typedIdentifier'),
  chainTyped(booleanLiteral.fromTypedExp)('typedBoolean'),
  chainTyped(numberLiteral.fromTypedExp)('typedNumber'),
  chainTyped(stringLiteral.fromTypedExp)('typedString'),
));
