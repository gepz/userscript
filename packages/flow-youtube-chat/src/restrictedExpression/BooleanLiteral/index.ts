import {
  pipe,
} from 'effect/Function';

import TaggedValue, {
  makeType,
} from '@/TaggedValue';
import TypedBoolean from '@/typedExpression/TypedBoolean';

type BooleanLiteral = TaggedValue<'booleanLiteral', {
  value: boolean
}>;

export const of = makeType<BooleanLiteral>('booleanLiteral');

export const fromTypedExp = ({
  value,
}: TypedBoolean): BooleanLiteral => pipe(
  {
    value: value.value,
  },
  of,
);

export default BooleanLiteral;
