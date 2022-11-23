import MainState from '@/MainState';

export default (
  lane: number,
  mainState: MainState,
): number => mainState.playerRect.height * ((
  ((lane / mainState.config.laneCount) + 0.005)
   * (mainState.config.flowY2 - mainState.config.flowY1)
) + mainState.config.flowY1);
