import { VNode } from 'hyperapp';
import AppPropertyKeys from "../../AppPropertyKeys";
import AppPropertyValues from "../../AppPropertyValues";
import ComputedProperties from "../../ComputedProperties";
import EditAction from "../../EditAction";
import Editable from "../../Editable";
import TextGetter from "../../TextGetter";
import AppNodeTextKey from "../AppNodeTextKey";
import EditSetter from "../../setter/EditSetter";
declare const _default: <State, C extends ComputedProperties<State>, AppCommander, Key extends AppPropertyKeys<State, C, Editable<readonly string[]>>>(editAction: EditAction<State, C, AppCommander>, getText: TextGetter<AppNodeTextKey | Key, State>, getState: <K extends Key>(k: K) => (s: State) => Editable<readonly string[]>) => (setter: EditSetter<Editable<readonly string[]> & AppPropertyValues<State, C, Key>>) => (label: Key, rows: number) => (c: AppCommander) => (s: State) => VNode<State>;
export default _default;
//# sourceMappingURL=index.d.ts.map