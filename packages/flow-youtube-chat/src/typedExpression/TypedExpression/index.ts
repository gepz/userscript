import * as E from 'effect/Either';
import {
  flow,
  pipe,
} from 'effect/Function';

import type Expression from '@/restrictedExpression/Expression';
import TypedArray, * as typedArray from '@/typedExpression/TypedArray';
import TypedBoolean, * as typedBoolean from '@/typedExpression/TypedBoolean';
import TypedCall, * as typedCall from '@/typedExpression/TypedCall';
// eslint-disable-next-line max-len
import TypedDotMember, * as typedDotMember from '@/typedExpression/TypedDotMember';
import TypedExpressionFunction from '@/typedExpression/typedExpressionFunction';
// eslint-disable-next-line max-len
import TypedIdentifier, * as typedIdentifier from '@/typedExpression/TypedIdentifier';
import TypedNumber, * as typedNumber from '@/typedExpression/TypedNumber';
import TypedString, * as typedString from '@/typedExpression/TypedString';
import chainTagged from '@/chainTagged';
import processWithEither from '@/processWithEither';
import RecordType from '@/type/RecordType';

type TypedExpression = TypedCall
| TypedIdentifier
| TypedArray
| TypedNumber
| TypedString
| TypedBoolean
| TypedDotMember;

export default TypedExpression;

export const chainExp = chainTagged<Expression>('tag');

export const fromExp = (
  env: RecordType,
): TypedExpressionFunction => (exp) => (expected) => pipe(
  exp,
  processWithEither(flow(
    chainExp(typedDotMember.fromExp)('dotMemberAccess'),
    chainExp(typedCall.fromExp)('callExpression'),
    chainExp(typedArray.fromExp)('arrayLiteral'),
    E.mapLeft((x) => x(fromExp(env))),
    chainExp(typedIdentifier.fromExp)('identifier'),
    chainExp(typedBoolean.fromExp)('booleanLiteral'),
    chainExp(typedNumber.fromExp)('numberLiteral'),
    chainExp(typedString.fromExp)('stringLiteral'),
  )),
  (x) => x({
    expected,
    env,
  }),
);

