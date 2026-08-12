import ComputedPropertySetters from '@userscript/ui/ComputedPropertySetters';
import * as Ed from '@userscript/ui/Editable';
import {
  pipe,
} from 'effect';

import AppCommander from '@/AppCommander';
import SettingState from '@/SettingState';
import SettingDispatchable from '@/settingUI/SettingDispatchable';
import computed from '@/settingUI/computed';
import configEffect from '@/settingUI/configEffect';
import stepTiming from '@/settingUI/stepTiming';

const setComputed = {
  useStepTiming: (v) => (c) => (s) => pipe(
    v
      ? stepTiming(Ed.value(s.timingStepCount))
      : 'linear',
    // Annotated so declaration emit writes the named type: the inferred
    // spread type spells out filterExp's jsep.Expression, which tsc
    // cannot name in a d.ts (TS4023).
    (timingFunction): SettingDispatchable => [
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
