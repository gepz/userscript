import * as Ed from '@userscript/ui/Editable';
import {
  Option as O,
} from 'effect';

import {
  fromUserConfig,
} from '@/EditableConfig';
import * as log from '@/Log';
import SettingState from '@/SettingState';
import UserConfig from '@/UserConfig';
import {
  SettingsPanelSize,
} from '@/settingsPanelSize';

export default (
  panelSize: SettingsPanelSize,
) => (config: UserConfig): SettingState => ({
  ...fromUserConfig(config),
  showPanel: false,
  mainTab: 0,
  logTab: 0,
  timingStepCount: Ed.of(parseInt(config.timingFunction.match(
    /^steps\((\d+),.+/,
  )?.[1] ?? '150', 10)),
  eventLog: log.empty(),
  laneHover: O.none(),
  lanePaintTarget: O.none(),
  panelRect: new DOMRectReadOnly(
    0,
    0,
    panelSize.width,
    panelSize.height,
  ),
});
