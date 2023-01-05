import * as O from 'fp-ts/Option';
import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray';

import TaggedValue from '@/TaggedValue';
import VarTypeMap from '@/filter/VarTypeMap';
import EvalType from '@/filter/type/EvalType';

type FunctionType = TaggedValue<'func', {
  typeMap: VarTypeMap,
  type: readonly [
    RNEA.ReadonlyNonEmptyArray<O.Option<EvalType>>,
    O.Option<Exclude<EvalType, FunctionType>>,
  ] }>;

export default FunctionType;
