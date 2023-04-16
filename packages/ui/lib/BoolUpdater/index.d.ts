import AppPropertyKeys from "../AppPropertyKeys";
import AppPropertyValues from "../AppPropertyValues";
import ComputedProperties from "../ComputedProperties";
import StateDispatchable from "../StateDispatchable";
export default interface BoolUpdater<State, C extends ComputedProperties<State>, AppCommander> {
    <K extends AppPropertyKeys<State, C, boolean>>(key: K): (c: AppCommander) => (s: State, e: Event) => StateDispatchable<State>;
}
export declare const make: <State, C extends ComputedProperties<State>, AppCommander>(updateAt: <K extends AppPropertyKeys<State, C, unknown>>(k: K) => (v: AppPropertyValues<State, C, K>) => (c: AppCommander) => (s: State) => StateDispatchable<State>) => BoolUpdater<State, C, AppCommander>;
//# sourceMappingURL=index.d.ts.map