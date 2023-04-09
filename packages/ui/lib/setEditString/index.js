import { flow, constant, } from '@effect/data/Function';
import * as Ed from "../Editable";
export default (editing) => flow((x) => constant(editing ? Ed.fromValueText(x)(x)
    : Ed.of(x)));
//# sourceMappingURL=index.js.map