import { constant, } from 'effect/Function';
import * as Ed from '../../Editable';
const setEditColor = (editing) => (value) => (editing
    ? (CSS.supports('color', value)
        ? constant(Ed.fromValueText(value)(value))
        : Ed.setText(value))
    : (CSS.supports('color', value)
        ? constant(Ed.of(value))
        : Ed.setTextInvalid(value)));
export default setEditColor;
//# sourceMappingURL=index.js.map