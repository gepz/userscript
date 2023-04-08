import {
  h,
  VNode,
  text,
} from 'hyperapp';

export default <T>(
  value: string,
  label: string,
  selected: boolean,
): VNode<T> => h('option', {
  value,
  selected,
}, text(label));
