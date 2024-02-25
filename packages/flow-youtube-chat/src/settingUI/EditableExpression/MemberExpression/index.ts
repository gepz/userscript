import ArrayExpression from '@/settingUI/editableExpression/ArrayExpression';
import type Expression from '@/settingUI/editableExpression/Expression';
import LiteralArray from '@/settingUI/editableExpression/LiteralArray';

export default interface MemberExpression {
  type: 'MemberExpression';
  computed: boolean;
  object: Expression;
  property: Exclude<Expression, ArrayExpression | LiteralArray>;
}

