import {
  Either as E,
  Option as O,
} from 'effect';
import AnimatingState from 'src/AnimatingState';

import flowDuration from '@/flowDuration';

export default (animationState: AnimatingState): number => animationState.pipe(
  E.match({
    onLeft: O.none<Animation>,
    onRight: O.some,
  }),
  O.flatMapNullable((x) => x.currentTime),
  O.map((x) => (typeof x === 'number' ? x : x.to('ms').value)),
  O.map((x) => x / flowDuration),
  O.getOrElse(() => 0),
);
