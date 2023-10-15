import * as O from 'effect/Option';

import type Expression from '@/settingUI/editableExpression/Expression';

export default interface CallExpression {
  type: 'CallExpression';
  argument: O.Option<Expression>;
  callee: Expression;
}
