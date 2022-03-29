import {
  h,
  VNode,
  Action,
  StyleProp,
} from 'hyperapp';

const style: StyleProp = {
  resize: 'horizontal',
  boxSizing: 'border-box',
  width: '100%',
};

export default <T>(
  rows: number,
  value: string,
  action: Partial<Record<
  'oninput'
  | 'onchange'
  | 'onfocus'
  | 'onblur'
  , Action<T>
  >>,
): VNode<T> => h('textarea', {
  rows,
  value,
  style,
  ...action,
});
