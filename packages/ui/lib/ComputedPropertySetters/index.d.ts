import ComputedProperties from '../ComputedProperties';
import StateDispatchable from '../StateDispatchable';
type ComputedPropertySetters<State, C extends ComputedProperties<State>, AppCommander> = {
    [K in keyof C]?: (v: ReturnType<C[K]>) => (c: AppCommander) => (s: State) => StateDispatchable<State>;
};
export default ComputedPropertySetters;
//# sourceMappingURL=index.d.ts.map