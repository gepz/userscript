import {
  pipe,
} from '@effect/data/Function';
import * as Ed from '@userscript/ui/Editable';

import AppCommander from '@/AppCommander';
import SettingState from '@/SettingState';
import SettingDispatchable from '@/settingUI/SettingDispatchable';
import computed from '@/settingUI/computed';
import configEffect from '@/settingUI/configEffect';
import stepTiming from '@/settingUI/stepTiming';

const setComputed: {
  [K in keyof typeof computed]: (
    v: ReturnType<(typeof computed)[K]>
  ) => (c: AppCommander) => (s: SettingState) => SettingDispatchable
} = {
  useStepTiming: (v) => (c) => (s) => pipe(
    v ? stepTiming(Ed.value(s.timingStepCount))
    : 'linear',
    (timingFunction) => [
      {
        ...s,
        timingFunction,
      },
      configEffect('timingFunction', timingFunction)(c),
    ],
  ),
};

export default setComputed;
