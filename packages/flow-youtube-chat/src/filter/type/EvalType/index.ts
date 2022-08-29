import type FunctionType from '@/filter/type/FunctionType';
import type RecordType from '@/filter/type/RecordType';
import type SimpleType from '@/filter/type/SimpleType';
import type TupleType from '@/filter/type/TupleType';
import type UnknownType from '@/filter/type/UnknownType';
import type VariableType from '@/filter/type/VariableType';

type EvalType = VariableType
| SimpleType
| FunctionType
| TupleType
| RecordType
| UnknownType;

export default EvalType;
