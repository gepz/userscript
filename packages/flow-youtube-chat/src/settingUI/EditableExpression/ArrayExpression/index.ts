import type Expression from '@/settingUI/editableExpression/Expression';

export default interface ArrayExpression {
  type: 'ArrayExpression';
  elements: readonly Expression[];
}
