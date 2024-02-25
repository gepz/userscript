import {
  h,
  VNode,
  Action,
  text,
} from 'hyperapp';

export default <T>(
  label: string,
  checked: boolean,
  onchange: Action<T>,
): VNode<T> => h('div', {}, h('label', {}, [
  text(label),
  h('input', {
    type: 'checkbox',
    checked,
    onchange,
  }),
]));

