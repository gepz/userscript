import { h, text, } from 'hyperapp';
export default (label, checked, onchange) => h('div', {}, h('label', {}, [
    text(label),
    h('input', {
        type: 'checkbox',
        checked,
        onchange,
    }),
]));
//# sourceMappingURL=index.js.map