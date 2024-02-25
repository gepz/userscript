import type Expression from '@/restrictedExpression/Expression';
import Type from '@/type/Type';
import type TypedExpression from '@/typedExpression/typedExpression';

type TypedExpressionFunction = (
  expression: Expression
) => (type: Type) => TypedExpression;

export default TypedExpressionFunction;

