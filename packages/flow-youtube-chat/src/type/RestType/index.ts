import TaggedValue, {
  makeType,
} from '@/TaggedValue';
import type Type from '@/type/Type';

type RestType = TaggedValue<'rest', Type>;

export default RestType;

export const of = makeType<RestType>('rest');

