import { ConditionalKeys } from 'type-fest';
import ComputedProperties from "../ComputedProperties";
type AppPropertyKeys<State, C extends ComputedProperties<State>, T> = keyof State & keyof C extends never ? ConditionalKeys<State, T> | ConditionalKeys<C, (s: State) => T> : never;
export default AppPropertyKeys;
//# sourceMappingURL=index.d.ts.map