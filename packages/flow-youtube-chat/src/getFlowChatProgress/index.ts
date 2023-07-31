import * as O from '@effect/data/Option';

import flowDuration from '@/flowDuration';

export default (animation: O.Option<Animation>): number => animation.pipe(
  O.flatMapNullable((x) => x.currentTime),
  O.getOrElse(() => 0),
  (x) => (typeof x === 'number' ? x : x.to('ms').value)
   / flowDuration,
);
