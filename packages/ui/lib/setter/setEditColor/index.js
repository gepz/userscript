import { constant, } from '@effect/data/Function';
import * as O from '@effect/data/Option';
import * as Tu from '@effect/data/Tuple';
import * as Ed from "../../Editable";
import EditSetter from "../EditSetter";
import validColor from "../../validColor";
const setEditColor = (editing) => (value) => (editing ? (validColor(value)
    ? constant(Ed.fromValueText(value)(value))
    : Ed.setText(value))
    : (validColor(value)
        ? constant(Ed.of(value))
        : Tu.mapSecond(constant(O.some([value, O.some('')])))));
export default setEditColor;
//# sourceMappingURL=index.js.map