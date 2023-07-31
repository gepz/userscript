import {
  identity,
} from 'effect/Function';
import {
  h,
  VNode,
  Action,
} from 'hyperapp';

export default <T>(
  action: Partial<Record<'onchange', Action<T>>>,
) => (color: string):VNode<T> => h('input', {
  style: {
    width: '36px',
    verticalAlign: 'middle',
  },
  type: 'color',
  value: color,
  oninput: action.onchange ?? identity,
});
