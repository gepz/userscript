import { VNode } from 'hyperapp';
import AppPropertyKeys from "../../AppPropertyKeys";
import AppPropertyValues from "../../AppPropertyValues";
import ComputedProperties from "../../ComputedProperties";
import EditAction from "../../EditAction";
import Editable from "../../Editable";
import TextGetter from "../../TextGetter";
import AppNodeTextKey from "../AppNodeTextKey";
import EditSetter from "../../setter/EditSetter";
declare const _default: <State, C extends ComputedProperties<State>, AppCommander, Key extends AppPropertyKeys<State, C, Editable<number>>>(editAction: EditAction<State, C, AppCommander>, getText: TextGetter<AppNodeTextKey | Key, State>, getState: <K extends Key>(k: K) => (s: State) => Editable<number>) => (setter: EditSetter<Editable<number> & AppPropertyValues<State, C, Key>>) => (label: Key, min: number, max: number, step: number) => (c: AppCommander) => (s: State) => VNode<State>;
export default _default;
//# sourceMappingURL=index.d.ts.map