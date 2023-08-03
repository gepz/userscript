import { h, text, } from 'hyperapp';
export default (label, error, content) => h('div', {}, [
    h('span', {}, text(label)),
    h('span', {
        style: {
            color: '#f55',
            marginLeft: '5px',
            whiteSpace: 'pre-wrap',
        },
    }, text(error)),
    h('div', {}, content),
]);
//# sourceMappingURL=index.js.map