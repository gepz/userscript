import Expression from '@/settingUI/EditableExpression/Expression';

export default interface ArrayExpression {
  type: 'ArrayExpression';
  elements: readonly Expression[];
}
