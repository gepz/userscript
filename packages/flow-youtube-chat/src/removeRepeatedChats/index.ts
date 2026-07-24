import {
  Array as A,
  Effect as Z,
  SynchronizedRef,
  pipe,
} from 'effect';

import FlowChat from '@/FlowChat';
import isRepeatedContent from '@/isRepeatedContent';

// Applies noRepeatedContent to the chats already flowing when the option
// turns on: of each set with the same content, only the earliest keeps
// flowing; the rest are removed at once.
export default (
  flowChats: SynchronizedRef.SynchronizedRef<readonly FlowChat[]>,
): Z.Effect<void> => SynchronizedRef.updateEffect(
  flowChats,
  (chats) => pipe(
    A.reduce(
      chats,
      {
        kept: A.empty<FlowChat>(),
        removed: A.empty<FlowChat>(),
      },
      ({
        kept, removed,
      }, chat) => (
        A.some(kept, (x) => isRepeatedContent(chat.data, x.data))
          ? {
            kept,
            removed: A.append(removed, chat),
          }
          : {
            kept: A.append(kept, chat),
            removed,
          }),
    ),
    ({
      kept, removed,
    }) => pipe(
      removed,
      Z.forEach((chat) => pipe(
        chat.animationState.pipe(
          Z.tap((animation) => Z.sync(() => animation.cancel())),
          Z.ignore,
        ),
        Z.zipRight(Z.sync(() => chat.element.remove())),
      )),
      Z.map(() => kept),
    ),
  ),
);
