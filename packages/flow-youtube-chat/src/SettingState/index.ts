import MappedConfigState from '@/MappedConfigState';
import * as Ed from '@/ui/Editable';

export default interface SettingState extends MappedConfigState {
  showPanel: boolean,
  mainTab: number,
  logTab: number,
  timingStepCount: Ed.Editable<number>,
  eventLog: readonly string[],
}
