import * as O from 'fp-ts/Option';
import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray';

import TaggedType from '@/TaggedType';
import EvalType from '@/filter/type/EvalType';

type FunctionType = TaggedType<'func', readonly [
  RNEA.ReadonlyNonEmptyArray<O.Option<EvalType>>,
  O.Option<EvalType>,
]>;

export default FunctionType;
