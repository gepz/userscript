import AppPropertyKeys from '@userscript/ui/AppPropertyKeys';

import SettingState from '@/SettingState';
import SettingValues from '@/settingUI/SettingValues';
import computed from '@/settingUI/computed';

type SettingKeys<
  T extends SettingValues,
> = AppPropertyKeys<SettingState, typeof computed, T>;

export default SettingKeys;
