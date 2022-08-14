import EvalType from '@/filter/EvalType';
import TaggedType from '@/filter/TaggedType';

type RecordType = TaggedType<'record', {
  [key: string]: EvalType,
}>;

export default RecordType;
