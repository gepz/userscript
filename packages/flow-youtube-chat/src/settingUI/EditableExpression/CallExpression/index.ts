import Expression from '@/settingUI/EditableExpression/Expression';

export default interface CallExpression {
  type: 'CallExpression';
  arguments: readonly Expression[];
  callee: Expression;
}
