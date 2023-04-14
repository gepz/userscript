import ComputedProperties from "../ComputedProperties";
import StateDispatchable from "../StateDispatchable";
type ComputedPropertiesSetter<State, C extends ComputedProperties<State>, AppCommander> = {
    [K in keyof C]?: (v: ReturnType<C[K]>) => (c: AppCommander) => (s: State) => StateDispatchable<State>;
};
export default ComputedPropertiesSetter;
//# sourceMappingURL=index.d.ts.map