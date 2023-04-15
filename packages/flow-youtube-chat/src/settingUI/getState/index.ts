import SettingState from '@/SettingState';
import SettingKeys from '@/settingUI/SettingKeys';
import SettingValues from '@/settingUI/SettingValues';
import computed from '@/settingUI/computed';

export default <K extends SettingKeys<unknown>>(k: K): (
  s: SettingState
) => SettingValues<K> => (
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  k in computed ? computed[k as never] as (s: SettingState) => never
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  : (s) => s[k as never] as never
);
