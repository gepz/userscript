import * as R from 'fp-ts/Reader';

import type Expression from '@/restrictedExpression/Expression';
import type TypedExpression from '@/typedExpression/typedExpression';
import Type from '@/type/Type';

type TypedExpressionFunction = R.Reader<
Expression,
R.Reader<Type, TypedExpression>
>;

export default TypedExpressionFunction;
