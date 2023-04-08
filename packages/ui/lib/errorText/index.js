import { constant, pipe, } from '@effect/data/Function';
import * as O from '@effect/data/Option';
import * as Ed from "../Editable";
export default (subject) => (edit) => pipe(edit, Ed.error, O.map((x) => `${subject}${x === '' ? '' : ': '}${x}`), O.getOrElse(constant('')));
//# sourceMappingURL=index.js.map