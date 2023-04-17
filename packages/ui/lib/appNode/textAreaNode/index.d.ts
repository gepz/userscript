import { VNode } from 'hyperapp';
import EditAction from "../../EditAction";
import Editable from "../../Editable";
import ExactTypeKey from "../../ExactTypeKey";
import AppTextGetter from "../AppTextGetter";
import EditSetter from "../../setter/EditSetter";
declare const _default: (setter: EditSetter<Editable<readonly string[]>>) => <State, Props, AppCommander, Key extends ExactTypeKey<Props, Editable<readonly string[]>>>(editAction: EditAction<State, Props, AppCommander>, getText: AppTextGetter<Key, State>, getState: <K extends ExactTypeKey<Props, Editable<readonly string[]>>>(k: K) => (s: State) => Editable<readonly string[]>) => (label: Key, rows: number) => (c: AppCommander) => (s: State) => VNode<State>;
export default _default;
//# sourceMappingURL=index.d.ts.map