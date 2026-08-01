import { Option as O, Tuple as Tu, } from 'effect';
import { constant, } from 'effect/Function';
import * as Ed from '../../Editable';
const setEditColor = (editing) => (value) => (editing
    ? (CSS.supports('color', value)
        ? constant(Ed.fromValueText(value)(value))
        : Ed.setText(value))
    : (CSS.supports('color', value)
        ? constant(Ed.of(value))
        : Tu.mapSecond(constant(O.some([value, O.some('')])))));
export default setEditColor;
//# sourceMappingURL=index.js.map