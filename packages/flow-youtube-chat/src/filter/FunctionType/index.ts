import * as O from 'fp-ts/Option';

import EvalType from '@/filter/EvalType';
import TaggedType from '@/filter/TaggedType';

type FunctionType = TaggedType<'func', readonly [
  readonly O.Option<EvalType>[] & {
    readonly 0: O.Option<EvalType>
  },
  O.Option<EvalType>,
]>;

export default FunctionType;
