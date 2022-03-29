import MainState from '@/MainState';

export default (
  mainState: MainState,
): number => Math.round((Math.max(mainState.getConfig.fontSize() - 0.2, 0.01)
   * mainState.playerRect.height / mainState.getConfig.laneCount()
   * (mainState.getConfig.flowY2() - mainState.getConfig.flowY1())
) * 100) / 100;
