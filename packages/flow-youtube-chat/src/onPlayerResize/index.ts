import * as IO from 'fp-ts/IO';
import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as S from 'fp-ts/State';
import {
  pipe,
  flow,
} from 'fp-ts/function';

import FlowChat from '@/FlowChat';
import MainState from '@/MainState';
import renderChat from '@/renderChat';
import setChatAnimation from '@/setChatAnimation';

export default (
  rect: O.Option<DOMRectReadOnly>,
  flowChats: FlowChat[],
  mainState: MainState,
): S.State<unknown[], IO.IO<void>> => pipe(
  rect,
  O.match<DOMRectReadOnly, S.State<unknown[], IO.IO<void>>>(
    () => S.of(() => {}),
    flow(
      (x) => () => {
        // eslint-disable-next-line no-param-reassign
        mainState.playerRect = x;
      },
      IO.map(() => flowChats),
      IO.map(RA.chain((x) => [
        renderChat(x)(mainState),
        setChatAnimation(x, flowChats)(mainState),
      ])),
      IO.chain(IO.sequenceArray),
      (io) => (s) => [io, [...s, 'Resize detected']],
    ),
  ),
);
