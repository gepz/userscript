import TaggedType from '@/TaggedType';
import EvalType from '@/filter/type/EvalType';
import RestType from '@/filter/type/RestType';

type TupleType = TaggedType<'tuple', readonly (EvalType | RestType)[]>;

export default TupleType;
