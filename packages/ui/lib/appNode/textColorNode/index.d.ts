import { StyleProp, VNode } from 'hyperapp';
import AppPropertyKeys from "../../AppPropertyKeys";
import AppPropertyValues from "../../AppPropertyValues";
import ComputedProperties from "../../ComputedProperties";
import EditAction from "../../EditAction";
import Editable from "../../Editable";
import AppTextGetter from "../AppTextGetter";
import EditSetter from "../../setter/EditSetter";
declare const _default: <State, C extends ComputedProperties<State>, AppCommander, Key extends AppPropertyKeys<State, C, Editable<string>>>(editAction: EditAction<State, C, AppCommander>, getText: AppTextGetter<Key, State>, getState: <K extends AppPropertyKeys<State, C, Editable<string>>>(k: K) => (s: State) => Editable<string>, getExampleTextStyle: (s: State) => StyleProp) => (setter: EditSetter<Editable<string> & AppPropertyValues<State, C, Key>>) => (label: Key) => (c: AppCommander) => (s: State) => VNode<State>;
export default _default;
//# sourceMappingURL=index.d.ts.map