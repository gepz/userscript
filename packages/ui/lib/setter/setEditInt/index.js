import { pipe, constant, } from '@effect/data/Function';
import * as O from '@effect/data/Option';
import * as Tu from '@effect/data/Tuple';
import * as Ed from "../../Editable";
import EditSetter from "../EditSetter";
const setEditInt = (editing) => (value) => (state) => pipe(value, Number.parseInt, editing
    ? (x) => (Number.isNaN(x) || value.at(-1) === '.'
        ? pipe(state, Ed.setText(value)) : Ed.fromValueText(x)(value))
    : (x) => (Number.isNaN(x)
        ? pipe(state, Tu.mapSecond(constant(O.some([value, O.some('')])))) : Ed.of(x)));
export default setEditInt;
//# sourceMappingURL=index.js.map