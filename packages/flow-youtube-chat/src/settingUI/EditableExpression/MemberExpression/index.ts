import Expression from '@/settingUI/EditableExpression/Expression';

export default interface MemberExpression {
  type: 'MemberExpression';
  computed: boolean;
  object: Expression;
  property: Expression;
}
