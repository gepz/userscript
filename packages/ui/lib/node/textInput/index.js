import { constant, pipe, } from 'effect/Function';
import * as O from 'effect/Option';
import { h, } from 'hyperapp';
import * as Ed from '../../Editable';
export default (action) => (value) => h('input', {
    style: {
        verticalAlign: 'middle',
        width: '5.5em',
        borderColor: Ed.hasError(value) ? '#f55' : null,
    },
    maxlength: 20,
    value: pipe(value, Ed.text, O.getOrElse(constant(Ed.value(value)))),
    ...action,
});
//# sourceMappingURL=index.js.map