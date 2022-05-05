import * as R from 'fp-ts/Reader';
import * as RA from 'fp-ts/ReadonlyArray';
import {
  pipe,
} from 'fp-ts/function';

import AppCommander from '@/AppCommander';
import SettingState from '@/SettingState';
import SettingDispatchable from '@/settingUI/SettingDispatchable';
import configEffect from '@/settingUI/configEffect';
import setRange from '@/settingUI/setRange';
import stepTiming from '@/settingUI/stepTiming';

const setState: Partial<{
  [K in keyof SettingState]: (
    v: SettingState[K]
  ) => R.Reader<AppCommander, R.Reader<SettingState, SettingDispatchable>>
}> = {
  flowY1: setRange('flowY1')('flowY2')((a) => (b) => Math.max(b, a + 0.05)),
  flowY2: setRange('flowY2')('flowY1')((a) => (b) => Math.min(b, a - 0.05)),
  flowX1: setRange('flowX1')('flowX2')((a) => (b) => Math.max(b, a + 0.05)),
  flowX2: setRange('flowX2')('flowX1')((a) => (b) => Math.min(b, a - 0.05)),
  timingStepCount: (v) => (c) => (s) => pipe(
    stepTiming(v),
    (timingFunction) => [
      {
        ...s,
        timingStepCount: v,
        timingFunction,
      },
      configEffect('timingFunction', timingFunction)(c.setConfig),
    ],
  ),
  bannedWordRegexs: (v) => (c) => (s) => pipe(
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
        ...s,
        bannedWordRegexs: v,
        bannedWordRegexsError: x.error,
        bannedWordRegexsValid: x.valid,
      },
      ...x.valid ? [configEffect('bannedWordRegexs', v)(c.setConfig)]
      : [],
    ],
  ),
};

export default setState;
