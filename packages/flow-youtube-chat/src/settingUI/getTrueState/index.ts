import SettingState from '@/SettingState';
import {
  TypeKey,
} from '@/TypeKey';
import StateKey from '@/settingUI/StateKey';
import computed from '@/settingUI/computed';

export default <T>(k: StateKey<T>, s: SettingState): T => (
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  k in computed ? computed[
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    k as TypeKey<typeof computed, (s: SettingState) => T>
  ](s) as unknown as T
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  : s[k as TypeKey<SettingState, T>] as unknown as T
);
