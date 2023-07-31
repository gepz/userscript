import {
  pipe,
} from 'effect/Function';

import TaggedValue, {
  makeType,
} from '@/TaggedValue';
import TypedNumber from '@/typedExpression/TypedNumber';

type NumberLiteral = TaggedValue<'numberLiteral', {
  value: number
}>;

export const of = makeType<NumberLiteral>('numberLiteral');

export const fromTypedExp = ({
  value,
}: TypedNumber): NumberLiteral => pipe(
  {
    value: value.value,
  },
  of,
);

export default NumberLiteral;
