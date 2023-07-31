import * as expEval from 'expression-eval';
import * as E from 'effect/Either';
import * as R from 'fp-ts/Reader';

import type Expression from '@/restrictedExpression/Expression';

type ExpressionFromJsExp = R.Reader<
expEval.parse.Expression,
E.Either<string, Expression>
>;

export default ExpressionFromJsExp;
