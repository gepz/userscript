import {
  flip,
} from '@effect/data/Function';
import * as Z from '@effect/io/Effect';

export default flip((
  chat: HTMLElement,
): (
  getEle: Z.Effect<never, never, HTMLElement>
  ) => Z.Effect<never, never, void> => Z.flatMap(
  (x) => Z.sync(() => chat.querySelector('#content #message')?.append(x)),
));
