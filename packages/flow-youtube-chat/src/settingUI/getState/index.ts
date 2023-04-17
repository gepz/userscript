import SettingState from '@/SettingState';
import SettingKey from '@/settingUI/SettingKey';
import SettingProps from '@/settingUI/SettingProps';
import computed from '@/settingUI/computed';

export default <K extends SettingKey<unknown>>(k: K): (
  s: SettingState
) => SettingProps[K] => (
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  k in computed ? computed[k as never] : (s) => s[k as never]
);
