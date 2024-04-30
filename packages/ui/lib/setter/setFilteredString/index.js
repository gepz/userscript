import { Array as A, Option as O, String as Str, } from 'effect';
import { pipe, } from 'effect/Function';
const setFilteredString = (allowedStrings) => (value) => (state) => pipe(value, O.liftPredicate((x) => A.containsWith(Str.Equivalence)(allowedStrings, x)), O.getOrElse(() => state));
export default setFilteredString;
//# sourceMappingURL=index.js.map