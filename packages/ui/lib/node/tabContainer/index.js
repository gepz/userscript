import { pipe, } from '@effect/data/Function';
import * as O from '@effect/data/Option';
import * as RA from '@effect/data/ReadonlyArray';
import { h, text, } from 'hyperapp';
export default (style) => (ontabSelect) => (labels) => (tabs) => (mainTab) => h('div', {
    style: style.container,
}, [
    h('div', {}, pipe(labels, RA.map((x, i) => h('span', {
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
    }, pipe(tabs, RA.get(mainTab), O.match(() => undefined, (x) => x()))),
]);
//# sourceMappingURL=index.js.map