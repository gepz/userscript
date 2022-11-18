import * as IO from 'fp-ts/IO';
import * as R from 'fp-ts/Reader';
import {
  pipe,
} from 'fp-ts/function';

const appendChatMessage: R.Reader<
R.Reader<HTMLElement, IO.IO<HTMLElement>>,
R.Reader<HTMLElement, IO.IO<void>>
> = R.chain((ele) => (chat) => pipe(
  ele,
  IO.chain((x) => () => chat.querySelector(
    '#content #message',
  )?.append(x)),
));

export default appendChatMessage;
