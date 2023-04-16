import { apply, flip, pipe, } from '@effect/data/Function';
import getChecked from "../getChecked";
export const make = (updateAt) => (key) => flip((s, e) => pipe(
// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
getChecked(e), updateAt(key), flip, apply(s)));
//# sourceMappingURL=index.js.map