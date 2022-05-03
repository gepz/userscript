import * as R from 'fp-ts/Reader';
import * as RA from 'fp-ts/ReadonlyArray';
import {
  pipe,
} from 'fp-ts/function';

import SettingConfig from '@/SettingConfig';
import SettingState from '@/SettingState';
import SettingDispatchable from '@/settingUI/SettingDispatchable';
import configEffect from '@/settingUI/configEffect';
import setRange from '@/settingUI/setRange';
import stepTiming from '@/settingUI/stepTiming';

const setState: Partial<{
  [K in keyof SettingState]: (
    v: SettingState[K]
  ) => R.Reader<SettingConfig, SettingDispatchable>
}> = {
  flowY1: setRange('flowY1')('flowY2')((a) => (b) => Math.max(b, a + 0.05)),
  flowY2: setRange('flowY2')('flowY1')((a) => (b) => Math.min(b, a - 0.05)),
  flowX1: setRange('flowX1')('flowX2')((a) => (b) => Math.max(b, a + 0.05)),
  flowX2: setRange('flowX2')('flowX1')((a) => (b) => Math.min(b, a - 0.05)),
  timingStepCount: (v) => (c) => pipe(
    stepTiming(v),
    (timingFunction) => [
      {
        ...c.state,
        timingStepCount: v,
        timingFunction,
      },
      configEffect('timingFunction', timingFunction)(c.command.setConfig),
    ],
  ),
  bannedWordRegexs: (v) => (c) => pipe(
    v,
    RA.reduce({
      valid: true,
      error: '',
    }, (acc, cur) => {
      try {
        RegExp(cur, 'u');
        return acc;
      } catch (e) {
        return {
          valid: false,
          // eslint-disable-next-line max-len
          // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
          error: `${acc.error}${e} in ${cur};`,
        };
      }
    }),
    (x) => [
      {
        ...c.state,
        bannedWordRegexs: v,
        bannedWordRegexsError: x.error,
        bannedWordRegexsValid: x.valid,
      },
      ...x.valid ? [configEffect('bannedWordRegexs', v)(c.command.setConfig)]
      : [],
    ],
  ),
};

export default setState;
