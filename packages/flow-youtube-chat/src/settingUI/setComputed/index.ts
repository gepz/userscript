import ComputedPropertySetters from '@userscript/ui/ComputedPropertySetters';
import * as Ed from '@userscript/ui/Editable';
import {
  pipe,
} from 'effect';

import AppCommander from '@/AppCommander';
import SettingState from '@/SettingState';
import computed from '@/settingUI/computed';
import configEffect from '@/settingUI/configEffect';
import stepTiming from '@/settingUI/stepTiming';

const setComputed = {
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
} satisfies ComputedPropertySetters<
SettingState,
typeof computed,
AppCommander
>;

export default setComputed;
