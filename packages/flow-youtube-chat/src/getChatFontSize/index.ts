import MainState from '@/MainState';

export default ({
  config,
  playerRect: {
    value: playerRect,
  },
}: MainState): number => Math.round((Math.max(config.fontSize - 0.2, 0.01)
   * playerRect.height / config.laneCount
   * (config.flowY2 - config.flowY1)
) * 100) / 100;
