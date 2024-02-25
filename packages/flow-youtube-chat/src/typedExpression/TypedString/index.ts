import type StringLiteral from '@/restrictedExpression/StringLiteral';
import TaggedValue, {
  makeType,
} from '@/TaggedValue';
import TypeBase from '@/typedExpression/TypeBase';
import Primitive from '@/type/Primitive';
import * as simpleType from '@/type/SimpleType';
import Type from '@/type/Type';

type TypedString = TaggedValue<'typedString', TypeBase & {
  value: string
}>;

export const of = makeType<TypedString>('typedString');

export const fromExp = ({
  value,
}: StringLiteral) => ({
  expected,
}: { expected: Type }): TypedString => of({
  value: value.value,
  expected,
  synthed: simpleType.fromPrimitive(Primitive.string),
});

export default TypedString;

