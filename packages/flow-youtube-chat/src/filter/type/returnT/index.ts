import * as O from 'fp-ts/Option';
import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray';
import * as RTu from 'fp-ts/ReadonlyTuple';
import {
  pipe,
  flow,
} from 'fp-ts/function';

import EvalType from '@/filter/type/EvalType';
import FunctionType from '@/filter/type/FunctionType';
import funcT from '@/filter/type/funcT';

export default (type: FunctionType): O.Option<EvalType> => pipe(
  type.type,
  O.fromPredicate((x): x is readonly [readonly [
    O.Option<EvalType>,
    O.Option<EvalType>,
    ...O.Option<EvalType>[],
  ], O.Option<EvalType>] => RTu.fst(x).length > 1),
  O.map(flow(
    RTu.mapFst(
      ([, ...tail]): RNEA.ReadonlyNonEmptyArray<
      O.Option<EvalType>
      > => tail,
    ),
    funcT,
  )),
  O.alt(() => pipe(
    type.type,
    RTu.snd,
  )),
);
