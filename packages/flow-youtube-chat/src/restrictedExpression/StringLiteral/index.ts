import {
  pipe,
} from '@effect/data/Function';

import TaggedValue, {
  makeType,
} from '@/TaggedValue';
import TypedString from '@/typedExpression/TypedString';

type StringLiteral = TaggedValue<'stringLiteral', {
  value: string
}>;

export const of = makeType<StringLiteral>('stringLiteral');

export const fromTypedExp = ({
  value,
}: TypedString): StringLiteral => pipe(
  {
    value: value.value,
  },
  of,
);

export default StringLiteral;
