import { VNode } from 'hyperapp';
import AppPropertyKeys from "../../AppPropertyKeys";
import AppPropertyValues from "../../AppPropertyValues";
import ComputedProperties from "../../ComputedProperties";
import EditAction from "../../EditAction";
import Editable from "../../Editable";
import AppTextGetter from "../AppTextGetter";
import EditSetter from "../../setter/EditSetter";
declare const _default: <State, C extends ComputedProperties<State>, AppCommander, Key extends AppPropertyKeys<State, C, Editable<number>>>(editAction: EditAction<State, C, AppCommander>, getText: AppTextGetter<Key, State>, getState: <K extends AppPropertyKeys<State, C, Editable<number>>>(k: K) => (s: State) => Editable<number>) => (setter: EditSetter<Editable<number> & AppPropertyValues<State, C, Key>>) => (label: Key, min: number, max: number, step: number) => (c: AppCommander) => (s: State) => VNode<State>;
export default _default;
//# sourceMappingURL=index.d.ts.map