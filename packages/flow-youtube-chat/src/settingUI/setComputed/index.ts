import * as R from 'fp-ts/Reader';
import {
  pipe,
} from 'fp-ts/function';

import SettingConfig from '@/SettingConfig';
import SettingDispatchable from '@/settingUI/SettingDispatchable';
import computed from '@/settingUI/computed';
import configEffect from '@/settingUI/configEffect';
import stepTiming from '@/settingUI/stepTiming';

const setComputed: {
  [K in keyof typeof computed]: (
    v: ReturnType<(typeof computed)[K]>
  ) => R.Reader<SettingConfig, SettingDispatchable>
} = {
  useStepTiming: (v) => (c) => pipe(
    v ? stepTiming(c.state.timingStepCount)
    : 'linear',
    (timingFunction) => [
      {
        ...c.state,
        timingFunction,
      },
      configEffect('timingFunction', timingFunction)(c.command.setConfig),
    ],
  ),
};

export default setComputed;
