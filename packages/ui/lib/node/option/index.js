import { h, text, } from 'hyperapp';
export default (value, label, selected) => h('option', {
    value,
    selected,
}, text(label));
//# sourceMappingURL=index.js.map