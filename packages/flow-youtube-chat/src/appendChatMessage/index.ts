import * as Z from 'effect/Effect';
import {
  flip,
} from 'effect/Function';

export default flip((
  chat: HTMLElement,
): (
  getEle: Z.Effect<HTMLElement>
  ) => Z.Effect<void> => Z.flatMap(
  (x) => Z.sync(() => chat.querySelector('#content #message')?.append(x)),
));

