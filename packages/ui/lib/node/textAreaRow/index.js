import { Array as A, Option as O, } from 'effect';
import { constant, pipe, } from 'effect/Function';
import { h, } from 'hyperapp';
import * as Ed from '../../Editable';
export default (rows, action) => (value) => h('textarea', {
    rows,
    // One entry per line: soft wrap would fold a long entry (a "handle
    // token" ban row, a long regex) into what looks like several entries,
    // so overflow scrolls horizontally instead.
    wrap: 'off',
    style: {
        resize: 'none',
        boxSizing: 'border-box',
        width: '100%',
        borderColor: Ed.hasError(value) ? '#f55' : null,
    },
    value: pipe(value, Ed.text, O.getOrElse(pipe(Ed.value(value), A.join('\n'), constant))),
    ...action,
});
//# sourceMappingURL=index.js.map