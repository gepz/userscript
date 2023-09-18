import * as Z from 'effect/Effect';
import { pipe, } from 'effect/Function';
import { app, } from 'hyperapp';
export default (comp, init) => pipe(Z.sync(() => document.createElement(comp.tag)), Z.flatMap((node) => Z.sync(() => ({
    node,
    dispatch: app({
        init,
        view: comp.view,
        node,
    }),
}))));
//# sourceMappingURL=index.js.map