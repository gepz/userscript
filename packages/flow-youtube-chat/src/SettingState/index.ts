import Editable from '@userscript/ui/Editable';

import Log from '@/Log';
import MappedConfigState from '@/MappedConfigState';

export default interface SettingState extends MappedConfigState {
  showPanel: boolean,
  mainTab: number,
  logTab: number,
  timingStepCount: Editable<number>,
  eventLog: Log,
  panelRect: DOMRectReadOnly,
}

