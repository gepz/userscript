import AppPropertyKeys from "../AppPropertyKeys";
import ComputedProperties from "../ComputedProperties";
type AppPropertyValues<State, C extends ComputedProperties<State>> = {
    [K in AppPropertyKeys<State, C, unknown>]: K extends keyof State ? State[K] : K extends keyof C ? ReturnType<C[K]> : never;
}[AppPropertyKeys<State, C, unknown>];
export default AppPropertyValues;
//# sourceMappingURL=index.d.ts.map