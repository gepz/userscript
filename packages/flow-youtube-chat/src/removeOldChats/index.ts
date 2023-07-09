import * as B from '@effect/data/Boolean';
import {
  pipe,
} from '@effect/data/Function';
import {
  contramap,
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
  Z.map(RA.sort(contramap((x: FlowChat) => !x.animationEnded)(B.Order))),
  (x) => x,
  Z.map(RA.splitAt(maxChatCount)),
  (x) => x,
  Z.flatMap(([newChats, oldChats]) => pipe(
    oldChats,
    Z.forEach((x) => pipe(
      Z.log({
        level: 'Debug',
      })('RemoveChat'),
      Z.zipRight(Z.sync(() => {
        x.element.remove();
      })),
    )),
    Z.map(() => newChats),
  )),
  (x) => x,
  Z.flatMap((x) => Z.sync(() => flowChats.next(x))),
);
