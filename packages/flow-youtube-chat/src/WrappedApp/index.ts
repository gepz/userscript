import {
  Dispatch,
} from 'hyperapp';

export default interface WrappedApp<T> {
  readonly node: HTMLElement,
  readonly dispatch: Dispatch<T>,
}
