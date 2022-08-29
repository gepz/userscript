import * as TT from '@/TaggedType';
import EvalType from '@/filter/type/EvalType';
import RestType from '@/filter/type/RestType';

type TupleType = TT.TaggedType<'tuple', readonly (EvalType | RestType)[]>;

export default TupleType;
