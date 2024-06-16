import {
  Effect as Z,
  SynchronizedRef,
} from 'effect';

import MainState from '@/MainState';

export default ({
  config: {
    value: config,
  },
  playerRect,
}: MainState): Z.Effect<number> => SynchronizedRef.get(playerRect).pipe(
  Z.map((rect) => Math.round((Math.max(config.fontSize - 0.2, 0.01)
  * rect.height / config.laneCount
  * (config.flowY2 - config.flowY1)
  ) * 100) / 100),
);
