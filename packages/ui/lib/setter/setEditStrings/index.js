import { pipe, constant, } from 'effect/Function';
import * as O from 'effect/Option';
import * as P from 'effect/Predicate';
import * as RA from 'effect/ReadonlyArray';
import * as Str from 'effect/String';
import * as Ed from '../../Editable';
const setEditStrings = (editing) => (value) => pipe(value, Str.split(/\r\n|\n/), RA.filter(P.not(Str.isEmpty)), (x) => constant(editing ? [x, O.some([value, O.none()])]
    : Ed.of(x)));
export default setEditStrings;
//# sourceMappingURL=index.js.map