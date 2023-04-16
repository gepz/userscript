import { flow, constant, } from '@effect/data/Function';
import * as Ed from "../../Editable";
const setEditString = (editing) => flow((x) => constant(editing ? Ed.fromValueText(x)(x)
    : Ed.of(x)));
export default setEditString;
//# sourceMappingURL=index.js.map