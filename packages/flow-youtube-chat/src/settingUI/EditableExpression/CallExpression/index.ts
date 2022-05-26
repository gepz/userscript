import * as O from 'fp-ts/Option';

import Expression from '@/settingUI/EditableExpression/Expression';

export default interface CallExpression {
  type: 'CallExpression';
  argument: O.Option<Expression>;
  callee: Expression;
}
