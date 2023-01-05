import TaggedValue from '@/TaggedValue';
import EvalType from '@/filter/type/EvalType';
import RestType from '@/filter/type/RestType';

type TupleType = TaggedValue<'tuple', readonly (EvalType | RestType)[]>;

export default TupleType;
