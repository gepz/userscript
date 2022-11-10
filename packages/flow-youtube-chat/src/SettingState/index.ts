import MappedConfigState from '@/MappedConfigState';
import Editable from '@/ui/Editable';

export default interface SettingState extends MappedConfigState {
  showPanel: boolean,
  mainTab: number,
  logTab: number,
  timingStepCount: Editable<number>,
  eventLog: readonly string[],
  panelRect: DOMRectReadOnly,
}
