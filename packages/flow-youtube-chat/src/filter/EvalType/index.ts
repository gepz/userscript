import type FunctionType from '@/filter/FunctionType';
import type RecordType from '@/filter/RecordType';
import type SimpleType from '@/filter/SimpleType';
import type TupleType from '@/filter/TupleType';
import type UnknownType from '@/filter/UnknownType';
import type VariableType from '@/filter/VariableType';

type EvalType = VariableType
| SimpleType
| FunctionType
| TupleType
| RecordType
| UnknownType;

export default EvalType;
