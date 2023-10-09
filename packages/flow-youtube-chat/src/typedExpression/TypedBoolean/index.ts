import TaggedValue, {
  makeType,
} from '@/TaggedValue';
import type BooleanLiteral from '@/restrictedExpression/BooleanLiteral';
import Primitive from '@/type/Primitive';
import * as simpleType from '@/type/SimpleType';
import Type from '@/type/Type';
import TypeBase from '@/typedExpression/TypeBase';

type TypedBoolean = TaggedValue<'typedBoolean', TypeBase & {
  value: boolean
}>;

export const of = makeType<TypedBoolean>('typedBoolean');

export const fromExp = ({
  value,
}: BooleanLiteral) => ({
  expected,
}: { expected: Type }): TypedBoolean => of({
  value: value.value,
  expected,
  synthed: simpleType.fromPrimitive(Primitive.boolean),
});

export default TypedBoolean;
