import {
  h,
  VNode,
  text,
} from 'hyperapp';

export default <T>(
  label: string,
  content: VNode<T>[],
): VNode<T> => h('div', {}, [
  h('span', {}, text(label)),
  h('div', {}, content),
]);
