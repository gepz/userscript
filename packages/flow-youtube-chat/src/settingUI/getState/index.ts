import SettingState from '@/SettingState';
import SettingKey from '@/settingUI/SettingKey';
import SettingProps from '@/settingUI/SettingProps';
import SettingValue from '@/settingUI/SettingValue';
import computed from '@/settingUI/computed';

export default <K extends SettingKey<unknown>>(k: K): (
  s: SettingState
) => SettingValue<K> & SettingProps[K] => (
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  k in computed ? computed[k as never] as (s: SettingState) => never
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  : (s) => s[k as never] as never
);
