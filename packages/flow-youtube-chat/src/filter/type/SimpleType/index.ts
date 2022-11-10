import TaggedType from '@/TaggedType';
import Primitive from '@/filter/type/Primitive';
import UI from '@/filter/type/UI';

type SimpleType = TaggedType<'simple', {
  pri: Primitive,
  ui: UI,
}>;

export default SimpleType;
