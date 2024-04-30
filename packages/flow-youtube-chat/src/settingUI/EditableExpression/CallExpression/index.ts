import {
  Option as O,
} from 'effect';


import type Expression from '@/settingUI/editableExpression/Expression';

export default interface CallExpression {
  type: 'CallExpression';
  argument: O.Option<Expression>;
  callee: Expression;
}
