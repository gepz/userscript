import {
  pipe,
} from '@effect/data/Function';
import * as O from '@effect/data/Option';

import FlowChat from '@/FlowChat';

export default (chat: FlowChat): number => pipe(
  chat.animation,
  O.flatMapNullable((x) => x.currentTime),
  O.getOrElse(() => 0),
  (x) => (typeof x === 'number' ? x : x.to('ms').value)
   / chat.animationDuration,
);
