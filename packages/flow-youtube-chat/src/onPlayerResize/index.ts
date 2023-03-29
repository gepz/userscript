import {
  pipe,
  flow,
} from '@effect/data/Function';
import * as O from '@effect/data/Option';
import * as RA from '@effect/data/ReadonlyArray';
import * as Z from '@effect/io/Effect';

import FlowChat from '@/FlowChat';
import MainState from '@/MainState';
import renderChat from '@/renderChat';
import setChatAnimation from '@/setChatAnimation';

export default (
  rect: O.Option<DOMRectReadOnly>,
  flowChats: FlowChat[],
  mainState: MainState,
): Z.Effect<never, never, void> => pipe(
  rect,
  Z.fromOption,
  Z.flatMap(flow(
    (x) => Z.sync(() => Object.assign(mainState, {
      playerRect: x,
    })),
    Z.map(() => flowChats),
    Z.map(RA.flatMap((x) => [
      renderChat(x)(mainState),
      setChatAnimation(x, flowChats)(mainState),
    ])),
    Z.flatMap((x) => Z.all(x)),
    Z.zipLeft(Z.logInfo('Resize detected')),
  )),
  Z.ignore,
);
