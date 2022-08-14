import EvalType from '@/filter/EvalType';
import RestType from '@/filter/RestType';
import TaggedType from '@/filter/TaggedType';

type TupleType = TaggedType<'tuple', readonly (EvalType | RestType)[]>;

export default TupleType;
