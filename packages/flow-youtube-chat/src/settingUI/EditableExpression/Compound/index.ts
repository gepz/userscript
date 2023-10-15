import type Expression from '@/settingUI/editableExpression/Expression';

export default interface Compound {
  type: 'Compound';
  body: readonly Expression[];
}
