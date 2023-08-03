import { constant, } from 'effect/Function';
import * as Ed from '../../Editable';
const setEditString = (editing) => (x) => constant(editing ? Ed.fromValueText(x)(x)
    : Ed.of(x));
export default setEditString;
//# sourceMappingURL=index.js.map