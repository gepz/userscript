import type Expression from '@/restrictedExpression/Expression';
import type TypedExpression from '@/typedExpression/typedExpression';

type ExpressionFromTypedExp = (x: TypedExpression) => Expression;

export default ExpressionFromTypedExp;
