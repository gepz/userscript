import {
  Dispatch,
} from 'hyperapp';

export default interface WrappedApp<T> {
  node: HTMLElement,
  dispatch: Dispatch<T>,
}
