import {
  Effect as Z,
  SynchronizedRef,
} from 'effect';

import MainState from '@/MainState';

export default (
  lane: number,
  {
    config: {
      value: config,
    },
    playerRect,
  }: MainState,
): Z.Effect<number> => SynchronizedRef.get(playerRect).pipe(
  Z.map((rect) => rect.height * ((
    ((lane / config.laneCount) + 0.005)
     * (config.flowY2 - config.flowY1)
  ) + config.flowY1)),
);
