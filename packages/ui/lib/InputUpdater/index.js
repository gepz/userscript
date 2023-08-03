import { apply, pipe, } from 'effect/Function';
import getValue from '../getValue';
export const make = (getState, updateAt) => (key) => (setter) => (c) => (s, e) => pipe(getValue(e), setter, apply(getState(key)(s)), updateAt(key), (x) => x(c)(s));
//# sourceMappingURL=index.js.map