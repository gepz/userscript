import TaggedValue from '@/TaggedValue';
import EvalType from '@/filter/type/EvalType';

type RecordType = TaggedValue<'record', {
  [key: string]: EvalType,
}>;

export default RecordType;
