import { constant, } from '@effect/data/Function';
import * as O from '@effect/data/Option';
import * as Tu from '@effect/data/Tuple';
import * as Ed from "../Editable";
import validColor from "../validColor";
export default (editing) => (value) => (editing
    ? (validColor(value)
        ? constant(Ed.fromValueText(value)(value))
        : Ed.setText(value))
    : (validColor(value)
        ? constant(Ed.of(value))
        : Tu.mapSecond(constant(O.some([value, O.some('')])))));
//# sourceMappingURL=index.js.map