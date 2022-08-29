import * as TT from '@/TaggedType';
import EvalType from '@/filter/type/EvalType';

type RecordType = TT.TaggedType<'record', {
  [key: string]: EvalType,
}>;

export default RecordType;
