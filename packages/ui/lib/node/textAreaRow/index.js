import { constant, pipe, } from 'effect/Function';
import * as O from 'effect/Option';
import * as RA from 'effect/ReadonlyArray';
import { h, } from 'hyperapp';
import * as Ed from '../../Editable';
export default (rows, action) => (value) => h('textarea', {
    rows,
    style: {
        resize: 'none',
        boxSizing: 'border-box',
        width: '100%',
        borderColor: Ed.hasError(value) ? '#f55' : null,
    },
    value: pipe(value, Ed.text, O.getOrElse(pipe(Ed.value(value), RA.join('\n'), constant))),
    ...action,
});
//# sourceMappingURL=index.js.map