import * as O from 'fp-ts/Option';

import TaggedType from '@/TaggedType';
import EvalType from '@/filter/type/EvalType';

type FunctionType = TaggedType<'func', readonly [
  readonly O.Option<EvalType>[] & {
    readonly 0: O.Option<EvalType>
  },
  O.Option<EvalType>,
]>;

export default FunctionType;
