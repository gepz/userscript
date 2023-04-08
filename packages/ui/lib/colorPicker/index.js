import { h, } from 'hyperapp';
export default (action) => (color) => h('input', {
    style: {
        width: '36px',
        verticalAlign: 'middle',
    },
    type: 'color',
    value: color,
    oninput: action.onchange,
});
//# sourceMappingURL=index.js.map