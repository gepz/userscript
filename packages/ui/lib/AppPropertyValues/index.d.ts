import AppPropertiesKey from "../AppPropertiesKey";
import ComputedProperties from "../ComputedProperties";
type AppPropertyValues<State, C extends ComputedProperties<State>, K extends AppPropertiesKey<State, C, unknown>> = K extends keyof State ? State[K] : K extends keyof C ? ReturnType<C[K]> : never;
export default AppPropertyValues;
//# sourceMappingURL=index.d.ts.map