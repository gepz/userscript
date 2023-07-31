import * as Z from 'effect/Effect';
import {
  flip,
} from 'effect/Function';

export default flip((
  chat: HTMLElement,
): (
  getEle: Z.Effect<never, never, HTMLElement>
  ) => Z.Effect<never, never, void> => Z.flatMap(
  (x) => Z.sync(() => chat.querySelector('#content #message')?.append(x)),
));
