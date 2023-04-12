import { pipe, constant, } from '@effect/data/Function';
import * as O from '@effect/data/Option';
import * as P from '@effect/data/Predicate';
import * as RA from '@effect/data/ReadonlyArray';
import * as Str from '@effect/data/String';
import * as Ed from "../Editable";
import Setter from "../setter/Setter";
export default (editing) => (value) => pipe(value, Str.split(/\r\n|\n/), RA.filter(P.not(Str.isEmpty)), (x) => constant(editing ? [x, O.some([value, O.none()])]
    : Ed.of(x)));
//# sourceMappingURL=index.js.map