import {
  flow,
  pipe,
} from '@effect/data/Function';
import * as Z from '@effect/io/Effect';

import MainState from '@/MainState';

export default (
  mainState: MainState,
) => (
  maxChatCount: number,
): Z.Effect<never, never, void> => pipe(
  Z.sync(() => mainState.flowChats.sort(
    (a, b) => (a.animationEnded === b.animationEnded ? 0
    : a.animationEnded ? -1
    : 1),
  )),
  Z.zipRight(Z.sync(() => mainState.flowChats.splice(
    0,
    Math.max(0, mainState.flowChats.length - maxChatCount),
  ))),
  Z.flatMap(Z.forEach((x) => pipe(
    Z.logDebug('RemoveChat'),
    Z.zipRight(Z.sync(() => {
      x.element.remove();
    })),
  ))),
);
