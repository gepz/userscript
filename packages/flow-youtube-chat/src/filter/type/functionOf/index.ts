import * as O from 'fp-ts/Option';
import {
  pipe,
} from 'fp-ts/function';

import EvalType from '@/filter/type/EvalType';
import FunctionType from '@/filter/type/FunctionType';
import funcT from '@/filter/type/funcT';

export default (parameter: EvalType) => (
  result: EvalType,
): FunctionType => pipe(
  result.tag === 'func' ? funcT(
    {
      typeMap: result.value.typeMap,
      type: [[O.of(parameter), ...result.value.type[0]], result.value.type[1]],
    },
  ) : funcT({
    typeMap: {},
    type: [[O.of(parameter)], O.of(result)],
  }),
);
