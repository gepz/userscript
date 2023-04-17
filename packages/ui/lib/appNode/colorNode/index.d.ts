import { VNode } from 'hyperapp';
import EditAction from "../../EditAction";
import Editable from "../../Editable";
import ExactTypeKey from "../../ExactTypeKey";
import AppTextGetter from "../AppTextGetter";
declare const _default: <State, Props, AppCommander, Key extends ExactTypeKey<Props, Editable<string>>>(editAction: EditAction<State, Props, AppCommander>, getText: AppTextGetter<Key, State>, getState: <K extends ExactTypeKey<Props, Editable<string>>>(k: K) => (s: State) => Editable<string>) => (label: Key) => (c: AppCommander) => (s: State) => VNode<State>;
export default _default;
//# sourceMappingURL=index.d.ts.map