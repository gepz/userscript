import { Array as A, Option as O, Predicate as P, String as Str, } from 'effect';
import { pipe, constant, } from 'effect/Function';
import * as Ed from '../../Editable';
const setEditStrings = (editing) => (value) => pipe(value, Str.split(/\r\n|\n/), A.filter(P.not(Str.isEmpty)), (x) => constant(editing ? [x, O.some([value, O.none()])]
    : Ed.of(x)));
export default setEditStrings;
//# sourceMappingURL=index.js.map