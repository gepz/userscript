import * as expEval from 'expression-eval';
import {
  pipe,
} from 'effect/Function';

import BooleanLiteral from '@/restrictedExpression/BooleanLiteral';
import * as booleanLiteral from '@/restrictedExpression/BooleanLiteral';
import NumberLiteral from '@/restrictedExpression/NumberLiteral';
import * as numberLiteral from '@/restrictedExpression/NumberLiteral';
import StringLiteral from '@/restrictedExpression/StringLiteral';
import * as stringLiteral from '@/restrictedExpression/StringLiteral';

type PrimitiveLiteral = StringLiteral | NumberLiteral | BooleanLiteral;

export const fromJsExp = (
  exp: expEval.parse.Literal,
): PrimitiveLiteral => pipe(
  exp.value,
  (x) => (typeof x === 'string' ? stringLiteral.of({
    value: x,
  }) : typeof x === 'number' ? numberLiteral.of({
    value: x,
  }) : booleanLiteral.of({
    value: x,
  })),
);

export const toJsep = ({
  value,
}: PrimitiveLiteral): expEval.parse.Literal => ({
  type: 'Literal',
  value: value.value,
  raw: JSON.stringify(value.value),
});

export default PrimitiveLiteral;
