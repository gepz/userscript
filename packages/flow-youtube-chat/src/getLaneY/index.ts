import MainState from '@/MainState';

export default (
  lane: number,
  mainState: MainState,
): number => mainState.playerRect.height * ((
  ((lane / mainState.getConfig.laneCount()) + 0.005)
   * (mainState.getConfig.flowY2() - mainState.getConfig.flowY1())
) + mainState.getConfig.flowY1());
