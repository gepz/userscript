import { Array as A, Option as O, } from 'effect';
import { pipe, } from 'effect/Function';
import { h, text, } from 'hyperapp';
export default (style) => (ontabSelect) => (labels) => (tabs) => (mainTab) => h('div', {
    style: style.container,
}, [
    h('div', {}, pipe(labels, A.map((x, i) => h('span', {
        style: {
            ...style.label,
            ...(mainTab === i ? style.labelFocus : {}),
            display: 'inline-block',
        },
        onpointerdown: [ontabSelect, i],
    }, text(x))))),
    h('div', {
        style: {
            ...style.tab,
            overflow: 'auto',
            boxSizing: 'border-box',
        },
    }, pipe(tabs, A.get(mainTab), O.match({
        onNone: () => undefined,
        onSome: (x) => x(),
    }))),
]);
//# sourceMappingURL=index.js.map