import { apply, pipe, } from '@effect/data/Function';
import AppPropertyKeys from "../AppPropertyKeys";
import AppPropertyValues from "../AppPropertyValues";
import ComputedProperties from "../ComputedProperties";
import StateDispatchable from "../StateDispatchable";
import getValue from "../getValue";
export const make = (getState, updateAt) => (setter) => (key) => (c) => (s, e) => pipe(getValue(e), setter, apply(getState(key)(s)), updateAt(key), (x) => x(c)(s));
//# sourceMappingURL=index.js.map