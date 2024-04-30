import { Array as A, Predicate as P, String as Str, } from 'effect';
import { pipe, constant, } from 'effect/Function';
const setStrings = (x) => pipe(Str.split(x, /\r\n|\n/), A.filter(P.not(Str.isEmpty)), constant);
export default setStrings;
//# sourceMappingURL=index.js.map