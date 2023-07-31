import * as B from '@effect/data/Boolean';
import {
  pipe,
} from '@effect/data/Function';
import {
  mapInput,
} from '@effect/data/Order';
import * as RA from '@effect/data/ReadonlyArray';
import * as Z from '@effect/io/Effect';
import {
  BehaviorSubject,
} from 'rxjs';

import FlowChat from '@/FlowChat';

export default (
  flowChats: BehaviorSubject<readonly FlowChat[]>,
) => (
  maxChatCount: number,
): Z.Effect<never, never, void> => pipe(
  Z.sync(() => flowChats.value),
  Z.map(RA.sort(mapInput((x: FlowChat) => !x.animationEnded)(B.Order))),
  Z.map((x) => RA.splitAt(x, x.length - maxChatCount)),
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
  Z.flatMap((x) => Z.sync(() => flowChats.next(x))),
);
