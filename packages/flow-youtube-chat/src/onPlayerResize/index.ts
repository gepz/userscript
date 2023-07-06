import {
  pipe,
  flow,
} from '@effect/data/Function';
import * as RA from '@effect/data/ReadonlyArray';
import * as Z from '@effect/io/Effect';

import MainState from '@/MainState';
import renderChat from '@/renderChat';
import setChatAnimation from '@/setChatAnimation';

export default (
  rect: DOMRectReadOnly,
  mainState: MainState,
): Z.Effect<never, never, void> => pipe(
  rect,
  Z.succeed,
  Z.tap((x) => Z.logDebug(
    `Resize [${x.width.toFixed(1)}, ${x.height.toFixed(1)}]`,
  )),
  Z.flatMap(flow(
    (x) => Z.sync(() => Object.assign(mainState, {
      playerRect: x,
    })),
    Z.map(() => mainState.flowChats),
    Z.map(RA.flatMap((x) => [
      renderChat(x)(mainState),
      setChatAnimation(x)(mainState),
    ])),
    Z.flatMap(Z.all),
  )),
);
