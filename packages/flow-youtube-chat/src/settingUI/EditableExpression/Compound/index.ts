import Expression from '@/settingUI/EditableExpression/Expression';

export default interface Compound {
  type: 'Compound';
  body: readonly Expression[];
}
