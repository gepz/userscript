import { VNode } from 'hyperapp';
import { ConditionalKeys } from 'type-fest';
import BoolUpdater from "../../BoolUpdater";
import AppTextGetter from "../AppTextGetter";
declare const _default: <State, Props, AppCommander, Key extends ConditionalKeys<Props, boolean>>(getText: AppTextGetter<Key, State>, getState: <K extends ConditionalKeys<Props, boolean>>(k: K) => (s: State) => boolean, updateBool: BoolUpdater<State, Props, AppCommander>) => (label: Key) => (c: AppCommander) => (s: State) => VNode<State>;
export default _default;
//# sourceMappingURL=index.d.ts.map