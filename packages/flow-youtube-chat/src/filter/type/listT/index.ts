import EvalType from '@/filter/type/EvalType';
import restT from '@/filter/type/restT';
import tupleT from '@/filter/type/tupleT';

export default (x: EvalType) => tupleT([restT(x)]);
