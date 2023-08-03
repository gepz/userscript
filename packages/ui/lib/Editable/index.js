import { constant, pipe, } from 'effect/Function';
import * as O from 'effect/Option';
import * as Tu from 'effect/Tuple';
export const of = (x) => [x, O.none()];
export const fromValueText = (v) => (t) => [v, O.some([t, O.none()])];
export const value = Tu.getFirst;
export const text = (x) => pipe(Tu.getSecond(x), O.map(Tu.getFirst));
export const error = (x) => pipe(Tu.getSecond(x), O.flatMap(Tu.getSecond));
export const setValue = (v) => pipe(constant(v), (x) => Tu.mapFirst(x));
export const setText = (x) => Tu.mapSecond((snd) => snd.pipe(O.map(Tu.mapFirst(constant(x))), O.orElse(constant(O.some([x, O.none()])))));
export const hasError = (x) => O.isSome(error(x));
//# sourceMappingURL=index.js.map