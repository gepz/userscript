import { VNode } from 'hyperapp';
import BoolUpdater from "../../BoolUpdater";
import ExactTypeKey from "../../ExactTypeKey";
import AppTextGetter from "../AppTextGetter";
declare const _default: <State, Props, AppCommander, Key extends ExactTypeKey<Props, boolean>>(getText: AppTextGetter<Key, State>, getState: <K extends ExactTypeKey<Props, boolean>>(k: K) => (s: State) => boolean, updateBool: BoolUpdater<State, Props, AppCommander>) => (label: Key) => (c: AppCommander) => (s: State) => VNode<State>;
export default _default;
//# sourceMappingURL=index.d.ts.map