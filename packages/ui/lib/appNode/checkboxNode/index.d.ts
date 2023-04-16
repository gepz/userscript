import { VNode } from 'hyperapp';
import AppPropertyKeys from "../../AppPropertyKeys";
import BoolUpdater from "../../BoolUpdater";
import ComputedProperties from "../../ComputedProperties";
import AppTextGetter from "../AppTextGetter";
declare const _default: <State, C extends ComputedProperties<State>, AppCommander, Key extends AppPropertyKeys<State, C, boolean>>(updateBool: BoolUpdater<State, C, AppCommander>, getText: AppTextGetter<Key, State>, getState: <K extends AppPropertyKeys<State, C, boolean>>(k: K) => (s: State) => boolean) => (label: Key) => (c: AppCommander) => (s: State) => VNode<State>;
export default _default;
//# sourceMappingURL=index.d.ts.map