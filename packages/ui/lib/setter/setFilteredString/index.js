import { pipe, } from '@effect/data/Function';
import * as O from '@effect/data/Option';
import * as RA from '@effect/data/ReadonlyArray';
import * as Str from '@effect/data/String';
import Setter from "../Setter";
const setFilteredString = (allowedStrings) => (value) => (state) => pipe(value, O.liftPredicate((x) => RA.contains(Str.Equivalence)(allowedStrings, x)), O.getOrElse(() => state));
export default setFilteredString;
//# sourceMappingURL=index.js.map