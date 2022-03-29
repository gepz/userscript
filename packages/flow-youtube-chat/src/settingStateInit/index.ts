import * as RA from 'fp-ts/ReadonlyArray';
import {
  pipe,
} from 'fp-ts/function';

import ConfigState from '@/ConfigState';
import SettingState from '@/SettingState';
import UserConfigGetter from '@/UserConfigGetter';

export default (getConfig: UserConfigGetter): SettingState => {
  const configState: ConfigState = pipe(
    Object.entries<() => unknown>(getConfig),
    RA.map(([k, v]) => [k, v()]),
    Object.fromEntries,
  );

  return {
    ...configState,
    showPanel: false,
    bannedWordRegexsValid: true,
    bannedWordRegexsError: '',
    mainTab: 0,
    logTab: 0,
    timingStepCount: parseInt(getConfig.timingFunction().match(
      /^steps\((\d+),.+/,
    )?.[1] ?? '150', 10),
    eventLog: [],
    editingInput: {
      id: '',
      committedState: undefined,
      value: '',
    },
  };
};
