import {
  VNode,
} from 'hyperapp';

export default interface RootComponent<T> {
  tag: keyof HTMLElementTagNameMap,
  view: (s: T) => VNode<T>
}
