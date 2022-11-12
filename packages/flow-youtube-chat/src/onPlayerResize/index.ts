import * as IO from 'fp-ts/IO';
import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import {
  pipe,
  flow,
} from 'fp-ts/function';

import FlowChat from '@/FlowChat';
import Logger from '@/Logger';
import MainState from '@/MainState';
import renderChat from '@/renderChat';
import setChatAnimation from '@/setChatAnimation';

export default (
  rect: O.Option<DOMRectReadOnly>,
  flowChats: FlowChat[],
  mainState: MainState,
  log: Logger,
): IO.IO<void> => pipe(
  rect,
  O.match<DOMRectReadOnly, IO.IO<void>>(
    () => () => {},
    flow(
      (x) => () => {
        // eslint-disable-next-line no-param-reassign
        mainState.playerRect = x;
      },
      IO.apSecond(log(['Resize detected'])),
      IO.map(() => flowChats),
      IO.map(RA.chain((x) => [
        renderChat(x)(mainState),
        setChatAnimation(x, flowChats)(mainState),
      ])),
      IO.chain(IO.sequenceArray),
    ),
  ),
);
