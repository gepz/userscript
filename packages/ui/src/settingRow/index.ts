import {
  h,
  VNode,
  text,
} from 'hyperapp';

export default <T>(
  label: string,
  error: string,
  content: VNode<T>[],
): VNode<T> => h('div', {}, [
  h('span', {}, text(label)),
  h('span', {
    style: {
      color: '#f55',
      marginLeft: '5px',
      whiteSpace: 'pre-wrap',
    },
  }, text(error)),
  h('div', {}, content),
]);
