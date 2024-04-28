import * as A from 'effect/Array';
import { pipe, } from 'effect/Function';
import * as O from 'effect/Option';
import * as Str from 'effect/String';
const setFilteredString = (allowedStrings) => (value) => (state) => pipe(value, O.liftPredicate((x) => A.containsWith(Str.Equivalence)(allowedStrings, x)), O.getOrElse(() => state));
export default setFilteredString;
//# sourceMappingURL=index.js.map