import * as O from '@effect/data/Option';
import {
  pipe,
} from '@effect/data/Function';

import FlowChat from '@/FlowChat';

export default (chat: FlowChat): number => pipe(
  chat.animation,
  O.flatMapNullable((x) => x.currentTime),
  O.getOrElse(() => 0),
  (x) => x / chat.animationDuration,
);
