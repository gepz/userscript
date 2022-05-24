import * as R from 'fp-ts/Reader';

import SettingState from '@/SettingState';
import {
  TypeKey,
} from '@/TypeKey';
import StateKey from '@/settingUI/StateKey';
import computed from '@/settingUI/computed';

export default <T>(k: StateKey<T>): R.Reader<SettingState, T> => (
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  k in computed ? computed[
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    k as TypeKey<typeof computed, R.Reader<SettingState, T>>
  ] as unknown as R.Reader<SettingState, T>
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  : (s) => s[k as TypeKey<SettingState, T>] as unknown as T
);
