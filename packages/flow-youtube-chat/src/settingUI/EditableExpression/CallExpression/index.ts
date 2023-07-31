import * as O from 'effect/Option';

import type Expression from '@/settingUI/EditableExpression/Expression';

export default interface CallExpression {
  type: 'CallExpression';
  argument: O.Option<Expression>;
  callee: Expression;
}
