import { pipe, constant, } from 'effect/Function';
import * as P from 'effect/Predicate';
import * as RA from 'effect/ReadonlyArray';
import * as Str from 'effect/String';
const setStrings = (x) => pipe(Str.split(x, /\r\n|\n/), RA.filter(P.not(Str.isEmpty)), constant);
export default setStrings;
//# sourceMappingURL=index.js.map