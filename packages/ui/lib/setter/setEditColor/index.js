import { Option as O, Tuple as Tu, } from 'effect';
import { constant, } from 'effect/Function';
import validateColor from 'validate-color';
import * as Ed from '../../Editable';
const setEditColor = (editing) => (value) => (editing ? (validateColor(value)
    ? constant(Ed.fromValueText(value)(value))
    : Ed.setText(value))
    : (validateColor(value)
        ? constant(Ed.of(value))
        : Tu.mapSecond(constant(O.some([value, O.some('')])))));
export default setEditColor;
//# sourceMappingURL=index.js.map