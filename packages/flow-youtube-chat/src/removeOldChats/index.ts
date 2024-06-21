import {
  Effect as Z,
  Either as E,
  Array as A,
  Boolean as B,
  pipe,
  SynchronizedRef,
} from 'effect';
import {
  mapInput,
} from 'effect/Order';

import FlowChat from '@/FlowChat';

export default (
  flowChats: SynchronizedRef.SynchronizedRef<readonly FlowChat[]>,
) => (
  maxChatCount: number,
): Z.Effect<void> => pipe(
  SynchronizedRef.get(flowChats),
  Z.map(A.sort(mapInput(
    (x: FlowChat) => E.isRight(x.animationState),
  )(B.Order))),
  Z.map((x) => A.splitAt(x, x.length - maxChatCount)),
  Z.flatMap(([oldChats, newChats]) => pipe(
    oldChats,
    Z.forEach((x) => pipe(
      Z.logDebug('RemoveChat'),
      Z.zipRight(Z.sync(() => {
        x.element.remove();
      })),
    )),
    Z.map(() => newChats),
  )),
  Z.tap((x) => Z.logDebug(`length after clear: ${x.length}`)),
  Z.flatMap((x) => SynchronizedRef.set(flowChats, x)),
);
