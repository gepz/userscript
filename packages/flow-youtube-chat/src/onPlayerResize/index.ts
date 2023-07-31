import {
  pipe,
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
  Z.succeed(rect),
  Z.tap((x) => Z.logDebug(
    `Resize [${x.width.toFixed(1)}, ${x.height.toFixed(1)}]`,
  )),
  Z.flatMap((r) => pipe(
    Z.sync(() => mainState.playerRect.next(r)),
    Z.map(() => mainState.flowChats.value),
    Z.map(RA.flatMap((x) => [
      renderChat(x)(mainState),
      Z.ignore(setChatAnimation(x)(mainState)),
    ])),
    Z.flatMap(Z.all),
  )),
);
