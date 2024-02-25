import {
  VNode,
} from 'hyperapp';

export default interface RootComponent<T> {
  tag: keyof HTMLElementTagNameMap,
  view: (s: T) => VNode<T>
}

export const makeComponent = <T>(
  x: (tag: keyof HTMLElementTagNameMap) => (s: T) => VNode<T>,
) => (tag: keyof HTMLElementTagNameMap): RootComponent<T> => ({
  tag,
  view: x(tag),
});

