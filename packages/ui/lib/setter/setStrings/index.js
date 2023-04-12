import { flow, constant, } from '@effect/data/Function';
import * as P from '@effect/data/Predicate';
import * as RA from '@effect/data/ReadonlyArray';
import * as Str from '@effect/data/String';
import Setter from "../setter";
const setStrings = flow(Str.split(/\r\n|\n/), RA.filter(P.not(Str.isEmpty)), constant);
export default setStrings;
//# sourceMappingURL=index.js.map