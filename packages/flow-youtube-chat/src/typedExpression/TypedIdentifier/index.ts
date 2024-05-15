import {
  pipe,
} from 'effect';

import type Identifier from '@/restrictedExpression/Identifier';
import TaggedValue, {
  makeType,
} from '@/TaggedValue';
import TypeBase from '@/typedExpression/TypeBase';
import RecordType from '@/type/RecordType';
import Type from '@/type/Type';
import * as unknownType from '@/type/UnknownType';

type TypedIdentifier = TaggedValue<'typedIdentifier', TypeBase & {
  name: string;
}>;

export const of = makeType<TypedIdentifier>('typedIdentifier');

export const fromExp = ({
  value,
}: Identifier) => ({
  expected,
  env,
} : {
  expected: Type,
  env: RecordType,
}): TypedIdentifier => pipe(
  value.name,
  (x) => of({
    name: x,
    expected,
    synthed: x in env.value ? env.value[x] : unknownType.unknown,
  }),
);

export default TypedIdentifier;
