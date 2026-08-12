import * as Ed from '@userscript/ui/Editable';
import {
  Array as A,
  Option as O,
  pipe,
} from 'effect';

import AppCommander from '@/AppCommander';
import SettingState from '@/SettingState';
import SettingDispatchable from '@/settingUI/SettingDispatchable';
import configEffect from '@/settingUI/configEffect';
import setRange from '@/settingUI/setRange';
import stepTiming from '@/settingUI/stepTiming';

const setState: Partial<{
  [K in keyof SettingState]: (
    v: SettingState[K],
  ) => (c: AppCommander) => (s: SettingState) => SettingDispatchable
}> = {
  // Trimming out-of-range excluded lanes is permanent: growing the
  // count back does not restore them. Only committed Editables trim, so
  // a mid-keystroke "2" of "20" cannot wipe lanes 2 and up.
  laneCount: (v) => (c) => (s) => pipe(
    O.isNone(Ed.text(v))
      ? A.filter(s.excludedLanes, (x) => x < Ed.value(v))
      : s.excludedLanes,
    (excludedLanes): SettingDispatchable => [
      {
        ...s,
        laneCount: v,
        excludedLanes,
      },
      configEffect('laneCount', Ed.value(v))(c),
      ...(excludedLanes.length === s.excludedLanes.length
        ? []
        : [configEffect('excludedLanes', excludedLanes)(c)]),
    ],
  ),
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
