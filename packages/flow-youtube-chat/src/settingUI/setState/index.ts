import * as Ed from '@userscript/ui/Editable';
import {
  pipe,
} from 'effect/Function';

import AppCommander from '@/AppCommander';
import SettingState from '@/SettingState';
import SettingDispatchable from '@/settingUI/SettingDispatchable';
import configEffect from '@/settingUI/configEffect';
import setRange from '@/settingUI/setRange';
import stepTiming from '@/settingUI/stepTiming';

const setState: Partial<{
  [K in keyof SettingState]: (
    v: SettingState[K]
  ) => (c: AppCommander) => (s: SettingState) => SettingDispatchable
}> = {
  flowY1: setRange('flowY1')('flowY2')((a) => (b) => Math.max(b, a + 0.05)),
  flowY2: setRange('flowY2')('flowY1')((a) => (b) => Math.min(b, a - 0.05)),
  flowX1: setRange('flowX1')('flowX2')((a) => (b) => Math.max(b, a + 0.05)),
  flowX2: setRange('flowX2')('flowX1')((a) => (b) => Math.min(b, a - 0.05)),
  timingStepCount: (v) => (c) => (s) => pipe(
    stepTiming(Ed.value(v)),
    (timingFunction) => [
      {
        ...s,
        timingStepCount: v,
        timingFunction,
      },
      configEffect('timingFunction', timingFunction)(c),
    ],
  ),
};

export default setState;
