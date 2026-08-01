import Editable from '@userscript/ui/Editable';
import {
  Option as O,
} from 'effect';

import Log from '@/Log';
import MappedConfigState from '@/MappedConfigState';

export default interface SettingState extends MappedConfigState {
  showPanel: boolean
  mainTab: number
  logTab: number
  timingStepCount: Editable<number>
  eventLog: Log
  panelRect: DOMRectReadOnly
  // Transient excluded-lanes strip state (see settingUI/laneToggleNode):
  // the lane under the pointer, and the value a paint drag is applying.
  laneHover: O.Option<number>
  lanePaintTarget: O.Option<boolean>
}
