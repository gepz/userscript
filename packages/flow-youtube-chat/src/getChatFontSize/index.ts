import MainState from '@/MainState';

export default (
  mainState: MainState,
): number => Math.round((Math.max(mainState.config.fontSize - 0.2, 0.01)
   * mainState.playerRect.height / mainState.config.laneCount
   * (mainState.config.flowY2 - mainState.config.flowY1)
) * 100) / 100;
