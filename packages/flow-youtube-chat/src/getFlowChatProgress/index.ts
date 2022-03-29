import * as O from 'fp-ts/Option';
import {
  pipe,
} from 'fp-ts/function';

import FlowChat from '@/FlowChat';

export default (chat: FlowChat): number => (
  pipe(
    chat.animation,
    O.chainNullableK((x) => x.currentTime),
    O.getOrElse(() => 0),
  )
) / chat.animationDuration;
