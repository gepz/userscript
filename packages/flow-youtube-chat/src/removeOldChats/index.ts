import {
  Array as A,
  Effect as Z,
  Either as E,
  pipe,
  SynchronizedRef,
} from 'effect';

import FlowChat from '@/FlowChat';

// Traced: runs on URL change / settings resets (cold), and the span makes
// Cause.pretty in the resilient/terminal handlers name this function.
export default (
  flowChats: SynchronizedRef.SynchronizedRef<readonly FlowChat[]>,
) => Z.fn('removeOldChats')((
  maxChatCount: number,
): Z.Effect<void> => SynchronizedRef.updateEffect(flowChats, (chats) => {
  const excess = chats.length - maxChatCount;

  if (excess <= 0) {
    return Z.succeed(chats);
  }

  // The trim prefers chats that are not animating (finished or never
  // started), then the earliest animating ones. The kept list stays in
  // insertion order: getChatLane's "inserted before me" reads and
  // addFlowChat's evict-the-earliest fallback both rely on it.
  const [notAnimating, animating] = A.partition(
    chats,
    (x) => E.isRight(x.animationState),
  );

  const removed = new Set([
    ...A.take(notAnimating, excess),
    ...A.take(animating, Math.max(0, excess - notAnimating.length)),
  ]);

  return pipe(
    Z.forEach(removed, (x) => pipe(
      Z.logDebug('RemoveChat'),
      Z.zipRight(x.animationState.pipe(
        Z.tap((animation) => Z.sync(() => animation.cancel())),
        Z.ignore,
      )),
      Z.zipRight(Z.sync(() => {
        x.element.remove();
      })),
    )),
    Z.map(() => A.filter(chats, (x) => !removed.has(x))),
    Z.tap((x) => Z.logDebug(`length after clear: ${x.length}`)),
  );
}));
