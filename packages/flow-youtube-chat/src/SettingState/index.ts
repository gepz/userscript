import MappedConfigState from '@/MappedConfigState';
import * as Ed from '@/ui/Editable';

type SettingState = MappedConfigState & {
  showPanel: boolean,
  mainTab: number,
  logTab: number,
  timingStepCount: Ed.Editable<number>,
  eventLog: readonly string[],
};

export default SettingState;
