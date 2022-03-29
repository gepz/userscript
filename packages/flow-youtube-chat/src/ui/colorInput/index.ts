import {
  h,
  VNode,
  Action,
} from 'hyperapp';

export default <T>(
  action: Partial<Record<
  'oninput'
  | 'onchange'
  | 'onfocus'
  | 'onblur'
  , Action<T>
  >>,
) => (color: string): VNode<T> => h('input', {
  style: {
    verticalAlign: 'middle',
    width: '5.5em',
  },
  maxlength: 20,
  value: color,
  ...action,
});
