import ArrayExpression from '@/settingUI/EditableExpression/ArrayExpression';
import type Expression from '@/settingUI/EditableExpression/Expression';
import LiteralArray from '@/settingUI/EditableExpression/LiteralArray';

export default interface MemberExpression {
  type: 'MemberExpression';
  computed: boolean;
  object: Expression;
  property: Exclude<Expression, ArrayExpression | LiteralArray>;
}
