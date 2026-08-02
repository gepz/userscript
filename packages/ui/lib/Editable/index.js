import { Option as O, Tuple as Tu, } from 'effect';
import { constant, pipe, } from 'effect/Function';
export const isEditable = (x) => (typeof x === 'object'
    && x !== null
    && 'tag' in x
    && x.tag === 'Editable');
export const of = (value) => ({
    tag: 'Editable',
    value,
    edit: O.none(),
});
export const fromValueText = (v) => (t) => ({
    tag: 'Editable',
    value: v,
    edit: O.some([t, O.none()]),
});
export const value = (x) => x.value;
export const text = (x) => pipe(x.edit, O.map(Tu.getFirst));
export const error = (x) => pipe(x.edit, O.flatMap(Tu.getSecond));
export const setValue = (v) => (e) => ({
    ...e,
    value: v,
});
export const setText = (t) => (e) => ({
    ...e,
    edit: e.edit.pipe(O.map(Tu.mapFirst(constant(t))), O.orElse(constant(O.some([t, O.none()])))),
});
export const setTextError = (t) => (err) => (e) => ({
    ...e,
    edit: O.some([t, O.some(err)]),
});
export const hasError = (x) => O.isSome(error(x));
//# sourceMappingURL=index.js.map