import * as Z from 'effect/Effect';
import {
  OperatorFunction,
  concatMap,
  from,
} from 'rxjs';

export default <T1, T2>(
  f: (x: T1) => Z.Effect<never, never, T2>,
): OperatorFunction<T1, T2> => concatMap((x) => from(Z.runPromise(f(x))));
