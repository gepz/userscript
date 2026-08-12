import { Option as O, } from 'effect';
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
    edit: O.some({
        text: t,
        error: O.none(),
    }),
});
export const value = (x) => x.value;
export const text = (x) => pipe(x.edit, O.map((e) => e.text));
export const error = (x) => pipe(x.edit, O.flatMap((e) => e.error));
// Functor map over the committed value; the draft state rides along
// untouched. Not for commit paths — committing a parsed draft goes
// through `of`, which deliberately drops the edit state.
export const map = (f) => (e) => ({
    ...e,
    value: f(e.value),
});
export const setValue = (v) => map(constant(v));
export const setText = (t) => (e) => ({
    ...e,
    edit: e.edit.pipe(O.map((x) => ({
        ...x,
        text: t,
    })), O.orElse(constant(O.some({
        text: t,
        error: O.none(),
    })))),
});
export const setTextError = (t) => (err) => (e) => ({
    ...e,
    edit: O.some({
        text: t,
        error: O.some(O.some(err)),
    }),
});
// For drafts whose invalidity has no detail worth reporting beyond the
// field's own generic error text (e.g. a plain parse failure).
export const setTextInvalid = (t) => (e) => ({
    ...e,
    edit: O.some({
        text: t,
        error: O.some(O.none()),
    }),
});
export const hasError = (x) => O.isSome(error(x));
//# sourceMappingURL=index.js.map