import { VNode, Action } from 'hyperapp';
import Editable from '@/Editable';
declare const _default: <T>(action: Partial<Record<'oninput' | 'onchange', Action<T>>>) => (value: Editable<string>) => VNode<T>;
export default _default;
