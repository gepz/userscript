import AppPropertiesKey from '../AppPropertiesKey';
import ComputedProperties from '../ComputedProperties';
type AppPropertiesValue<State, C extends ComputedProperties<State>, K extends AppPropertiesKey<State, C, unknown>> = K extends keyof State ? State[K] : K extends keyof C ? ReturnType<C[K]> : never;
export default AppPropertiesValue;
//# sourceMappingURL=index.d.ts.map