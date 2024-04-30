import {
  Effect as Z,
} from 'effect';
import {
  OperatorFunction,
  concatMap,
  from,
  map,
} from 'rxjs';

export default <T1>(
  f: (x: T1) => Z.Effect<unknown>,
): OperatorFunction<T1, T1> => concatMap((x) => from(Z.runPromise(f(x))).pipe(
  map(() => x),
));
