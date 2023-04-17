import { ConditionalKeys } from 'type-fest';
import ComputedProperties from "../ComputedProperties";
type AppPropertyKeys<State, C extends ComputedProperties<State>, T> = ConditionalKeys<State, T> | (ConditionalKeys<C, (s: State) => T> & ConditionalKeys<C, (s: State) => unknown>);
export default AppPropertyKeys;
//# sourceMappingURL=index.d.ts.map