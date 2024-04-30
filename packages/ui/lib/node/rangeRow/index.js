import { Option as O, } from 'effect';
import { constant, pipe, identity, } from 'effect/Function';
import { h, } from 'hyperapp';
import * as Ed from '../../Editable';
export default (config, action) => (value) => h('div', {}, [
    h('input', {
        style: {
            width: '150px',
            verticalAlign: 'middle',
        },
        type: 'range',
        ...config,
        value: Ed.value(value).toString(),
        oninput: action.onchange ?? identity,
    }),
    h('input', {
        style: {
            width: '30px',
            backgroundColor: 'transparent',
            color: 'inherit',
            borderWidth: '1px',
            verticalAlign: 'middle',
            borderColor: Ed.hasError(value) ? '#f55' : null,
        },
        inputmode: 'decimal',
        value: pipe(value, Ed.text, O.getOrElse(constant(Ed.value(value).toFixed(4).replace(/\.?0+$/, '')))),
        ...action,
    }),
]);
//# sourceMappingURL=index.js.map