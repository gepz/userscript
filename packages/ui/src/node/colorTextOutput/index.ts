import {
  h,
  VNode,
  StyleProp,
  text,
} from 'hyperapp';

export default <T>(
  textStyle: StyleProp,
) => (color: string): VNode<T> => h('span', {
  style: {
    ...textStyle,
    color,
  },
}, text('Aa1あア亜'));

