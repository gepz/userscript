import TaggedType from '@/TaggedType';
import EvalType from '@/filter/type/EvalType';

type RecordType = TaggedType<'record', {
  [key: string]: EvalType,
}>;

export default RecordType;
