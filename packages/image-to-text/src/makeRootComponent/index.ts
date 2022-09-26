import {
  VNode,
} from 'hyperapp';

import RootComponent from '@/RootComponent';

export default <T>(
  x: (tag: keyof HTMLElementTagNameMap) => (s: T) => VNode<T>,
) => (tag: keyof HTMLElementTagNameMap): RootComponent<T> => ({
  tag,
  view: x(tag),
});
