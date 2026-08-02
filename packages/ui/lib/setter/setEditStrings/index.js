import { Array as A, Predicate as P, String as Str, } from 'effect';
import { pipe, constant, } from 'effect/Function';
import * as Ed from '../../Editable';
const setEditStrings = (editing) => (value) => pipe(value, Str.split(/\r\n|\n/), A.filter(P.not(Str.isEmpty)), (x) => constant(editing
    ? Ed.fromValueText(x)(value)
    : Ed.of(x)));
export default setEditStrings;
//# sourceMappingURL=index.js.map