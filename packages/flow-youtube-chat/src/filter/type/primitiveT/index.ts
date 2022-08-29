import * as TT from '@/TaggedType';
import Primitive from '@/filter/type/Primitive';
import SimpleType from '@/filter/type/SimpleType';
import UI from '@/filter/type/UI';

export default (
  pri: Primitive,
) => TT.makeType<SimpleType>('simple')({
  pri,
  ui: UI.unknown,
});
