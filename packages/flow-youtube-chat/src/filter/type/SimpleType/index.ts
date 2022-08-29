import * as TT from '@/TaggedType';
import Primitive from '@/filter/type/Primitive';
import UI from '@/filter/type/UI';

type SimpleType = TT.TaggedType<'simple', {
  pri: Primitive,
  ui: UI,
}>;

export default SimpleType;
