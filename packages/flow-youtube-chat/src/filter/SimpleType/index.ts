import Primitive from '@/filter/Primitive';
import TaggedType from '@/filter/TaggedType';
import UI from '@/filter/UI';

type SimpleType = TaggedType<'simple', {
  pri: Primitive,
  ui: UI,
}>;

export default SimpleType;
