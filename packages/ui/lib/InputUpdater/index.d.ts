import AppPropertyKeys from "../AppPropertyKeys";
import AppPropertyValues from "../AppPropertyValues";
import ComputedProperties from "../ComputedProperties";
import StateDispatchable from "../StateDispatchable";
import { Setter } from "../setter";
export default interface InputUpdater<State, C extends ComputedProperties<State>, AppCommander> {
    <K extends AppPropertyKeys<State, C, unknown>>(key: K): (setter: Setter<string, AppPropertyValues<State, C, K>>) => (c: AppCommander) => (s: State, e: Event) => StateDispatchable<State>;
}
export declare const make: <State, C extends ComputedProperties<State>, AppCommander>(getState: <K extends AppPropertyKeys<State, C, unknown>>(k: K) => (s: State) => AppPropertyValues<State, C, K>, updateAt: <K_1 extends AppPropertyKeys<State, C, unknown>>(k: K_1) => (v: AppPropertyValues<State, C, K_1>) => (c: AppCommander) => (s: State) => StateDispatchable<State>) => InputUpdater<State, C, AppCommander>;
//# sourceMappingURL=index.d.ts.map