import {
  Effect as Z,
} from 'effect';

import * as expEval from 'expression-eval';

import type Expression from '@/restrictedExpression/Expression';

type ExpressionFromJsExp = (
  exp: expEval.parse.Expression
) => Z.Effect<Expression, string>;

export default ExpressionFromJsExp;
