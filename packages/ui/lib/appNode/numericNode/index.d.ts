import { VNode } from 'hyperapp';
import { ConditionalKeys } from 'type-fest';
import EditAction from "../../EditAction";
import Editable from "../../Editable";
import AppTextGetter from "../AppTextGetter";
import EditSetter from "../../setter/EditSetter";
declare const _default: <State, Props, AppCommander, Key extends ConditionalKeys<Props, Editable<number>>>(editAction: EditAction<State, Props, AppCommander>, getText: AppTextGetter<Key, State>, getState: <K extends ConditionalKeys<Props, Editable<number>>>(k: K) => (s: State) => Editable<number>) => (setter: EditSetter<Editable<number> & Props[Key]>) => (label: Key, min: number, max: number, step: number) => (c: AppCommander) => (s: State) => VNode<State>;
export default _default;
//# sourceMappingURL=index.d.ts.map