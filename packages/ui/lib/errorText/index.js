import { Option as O, } from 'effect';
import { constant, pipe, } from 'effect/Function';
import * as Ed from '../Editable';
export default (subject) => (edit) => pipe(edit, Ed.error, O.map((x) => `${subject}${x === '' ? '' : ': '}${x}`), O.getOrElse(constant('')));
//# sourceMappingURL=index.js.map