import TaggedValue from '@/TaggedValue';
import Primitive from '@/filter/type/Primitive';
import UI from '@/filter/type/UI';

type SimpleType = TaggedValue<'simple', {
  pri: Primitive,
  ui: UI,
}>;

export default SimpleType;
