import { VNode } from 'hyperapp';
import EditAction from '@/EditAction';
import Editable from '@/Editable';
import ExactTypeKey from '@/ExactTypeKey';
import AppTextGetter from '@/appNode/AppTextGetter';
import EditSetter from '@/setter/EditSetter';
declare const _default: (setter: EditSetter<Editable<number>>) => <State, Props, AppCommander, Key extends ExactTypeKey<Props, Editable<number>>>(editAction: EditAction<State, Props, AppCommander>, getText: AppTextGetter<Key, State>, getState: <K extends ExactTypeKey<Props, Editable<number>>>(k: K) => (s: State) => Editable<number>) => (label: Key, min: number, max: number, step: number) => (c: AppCommander) => (s: State) => VNode<State>;
export default _default;
