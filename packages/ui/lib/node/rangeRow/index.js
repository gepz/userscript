import { constant, pipe, } from '@effect/data/Function';
import * as O from '@effect/data/Option';
import { h, } from 'hyperapp';
import * as Ed from "../../Editable";
export default (min, max, step, action) => (value) => h('div', {}, [
    h('input', {
        style: {
            width: '150px',
            verticalAlign: 'middle',
        },
        type: 'range',
        min,
        max,
        step,
        value: Ed.value(value).toString(),
        oninput: action.onchange,
    }),
    h('input', {
        style: {
            width: '30px',
            backgroundColor: 'transparent',
            color: 'inherit',
            borderWidth: '1px',
            verticalAlign: 'middle',
            borderColor: Ed.hasError(value) ? '#f55' : undefined,
        },
        inputmode: 'decimal',
        value: pipe(value, Ed.text, O.getOrElse(constant(Ed.value(value).toFixed(4).replace(/\.?0+$/, '')))),
        ...action,
    }),
]);
//# sourceMappingURL=index.js.map