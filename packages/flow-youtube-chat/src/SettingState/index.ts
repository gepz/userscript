import Log from '@/Log';
import MappedConfigState from '@/MappedConfigState';
import Editable from '@userscript/ui/Editable';

export default interface SettingState extends MappedConfigState {
  showPanel: boolean,
  mainTab: number,
  logTab: number,
  timingStepCount: Editable<number>,
  eventLog: Log,
  panelRect: DOMRectReadOnly,
}
