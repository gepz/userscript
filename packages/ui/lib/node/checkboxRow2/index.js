import { h, } from 'preact';
const checkboxRow2 = ({ label, checked, onchange, }) => h('div', {}, h('label', {}, [
    label,
    h('input', {
        type: 'checkbox',
        checked,
        onchange,
    }),
]));
export default checkboxRow2;
//# sourceMappingURL=index.js.map