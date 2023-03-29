import * as Z from '@effect/io/Effect';
import {
  OperatorFunction,
  concatMap,
  from,
  map,
} from 'rxjs';

export default <T1>(
  f: (x: T1) => Z.Effect<never, never, unknown>,
): OperatorFunction<T1, T1> => concatMap((x) => from(Z.runPromise(f(x))).pipe(
  map(() => x),
));
