import AppPropertyKeys from "../AppPropertyKeys";
import AppPropertyValues from "../AppPropertyValues";
import ComputedProperties from "../ComputedProperties";
import StateDispatchable from "../StateDispatchable";
import { Setter } from "../setter";
export default interface InputUpdater<State, C extends ComputedProperties<State>, AppCommander, VT extends AppPropertyValues<State, C>> {
    <T extends VT>(setter: Setter<string, T>): (key: AppPropertyKeys<State, C, T>) => (c: AppCommander) => (s: State, e: Event) => StateDispatchable<State>;
}
export declare const make: <State, C extends ComputedProperties<State>, AppCommander, VT extends AppPropertyValues<State, C>>(getState: <T extends VT>(k: AppPropertyKeys<State, C, T>) => (s: State) => T, updateAt: <T_1 extends VT>(k: AppPropertyKeys<State, C, T_1>) => (v: T_1) => (c: AppCommander) => (s: State) => StateDispatchable<State>) => InputUpdater<State, C, AppCommander, VT>;
//# sourceMappingURL=index.d.ts.map