import {
  Effect as Z,
  pipe,
} from 'effect';

import MainState from '@/MainState';
import renderChat from '@/renderChat';
import setChatAnimation from '@/setChatAnimation';

export default (
  rect: DOMRectReadOnly,
  mainState: MainState,
): Z.Effect<void> => pipe(
  Z.succeed(rect),
  Z.tap((x) => Z.logDebug(
    `Resize [${x.width.toFixed(1)}, ${x.height.toFixed(1)}]`,
  )),
  Z.flatMap((r) => pipe(
    Z.sync(() => mainState.playerRect.next(r)),
    Z.map(() => mainState.flowChats.value),
    Z.flatMap(Z.forEach((x) => Z.all([
      renderChat(x)(mainState),
      Z.ignore(setChatAnimation(x)(mainState)),
    ]))),
  )),
);
