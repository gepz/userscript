import MainState from '@/MainState';

export default (
  lane: number,
  {
    config: {
      value: config,
    },
    playerRect: {
      value: playerRect,
    },
  }: MainState,
): number => playerRect.height * ((
  ((lane / config.laneCount) + 0.005)
   * (config.flowY2 - config.flowY1)
) + config.flowY1);

