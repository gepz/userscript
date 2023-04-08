import { constant, flow, } from '@effect/data/Function';
import * as O from '@effect/data/Option';
import * as Tu from '@effect/data/Tuple';
export const of = (x) => [x, O.none()];
export const fromValueText = (v) => (t) => [v, O.some([t, O.none()])];
export const value = Tu.getFirst;
export const text = flow(Tu.getSecond, O.map(Tu.getFirst));
export const error = flow(Tu.getSecond, O.flatMap(Tu.getSecond));
export const setValue = flow(constant, (x) => Tu.mapFirst(x));
export const setText = (x) => Tu.mapSecond(flow(O.map(Tu.mapFirst(constant(x))), O.orElse(constant(O.some([x, O.none()])))));
export const hasError = flow(error, O.isSome);
//# sourceMappingURL=index.js.map