import * as TT from '@/TaggedType';
import EvalType from '@/filter/type/EvalType';

type RestType = TT.TaggedType<'rest', EvalType>;

export default RestType;
