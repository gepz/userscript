import {
  ConditionalKeys,
} from 'type-fest';

import SettingState from '@/SettingState';
import SettingKeys from '@/settingUI/SettingKeys';
import computed from '@/settingUI/computed';

export default <T>(k: SettingKeys<T>): (s: SettingState) => T => (
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  k in computed ? computed[
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    k as ConditionalKeys<typeof computed, (s: SettingState) => T>
  ] as unknown as (s: SettingState) => T
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  : (s) => s[k as ConditionalKeys<SettingState, T>] as unknown as T
);
