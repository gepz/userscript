import type NumberLiteral from '@/restrictedExpression/NumberLiteral';
import TaggedValue, {
  makeType,
} from '@/TaggedValue';
import TypeBase from '@/typedExpression/TypeBase';
import Primitive from '@/type/Primitive';
import * as simpleType from '@/type/SimpleType';
import Type from '@/type/Type';

type TypedNumber = TaggedValue<'typedNumber', TypeBase & {
  value: number
}>;

export const of = makeType<TypedNumber>('typedNumber');

export const fromExp = ({
  value,
}: NumberLiteral) => ({
  expected,
}: { expected: Type }): TypedNumber => of({
  value: value.value,
  expected,
  synthed: simpleType.fromPrimitive(Primitive.number),
});

export default TypedNumber;

