import * as IO from 'fp-ts/IO';
import * as R from 'fp-ts/Reader';
import {
  flip,
} from 'fp-ts/function';

export default flip((
  chat: HTMLElement,
): R.Reader<IO.IO<HTMLElement>, IO.IO<void>> => IO.chain(
  (x) => () => chat.querySelector('#content #message')?.append(x),
));
