import * as IO from 'fp-ts/IO';
import {
  pipe,
} from 'fp-ts/function';
import log from 'loglevel';

import FlowChat from '@/FlowChat';

export default (
  flowChats: FlowChat[],
) => (
  maxChatCount: number,
): IO.IO<void> => pipe(
  () => flowChats.sort((a, b) => (a.animationEnded === b.animationEnded ? 0
  : a.animationEnded ? -1
  : 1)),
  IO.apSecond(() => flowChats.splice(
    0,
    Math.max(0, flowChats.length - maxChatCount),
  )),
  IO.chain((removed) => () => removed.forEach((x) => {
    log.debug('RemoveChat');
    x.element.remove();
  })),
);
