import { pipe, } from 'effect/Function';
import * as Ed from '../../Editable';
const setEditNumber = (editing) => (value) => (state) => pipe(value, Number.parseFloat, editing
    ? (x) => (Number.isNaN(x) || value.at(-1) === '.'
        ? pipe(state, Ed.setText(value))
        : Ed.fromValueText(x)(value))
    : (x) => (Number.isNaN(x)
        ? pipe(state, Ed.setTextError(value)(''))
        : Ed.of(x)));
export default setEditNumber;
//# sourceMappingURL=index.js.map