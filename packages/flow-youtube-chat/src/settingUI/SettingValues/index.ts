import AppPropertyValues from '@userscript/ui/AppPropertyValues';

import SettingState from '@/SettingState';
import SettingKeys from '@/settingUI/SettingKeys';
import computed from '@/settingUI/computed';

type SettingValues<K extends SettingKeys<unknown>> = AppPropertyValues<
SettingState,
typeof computed,
K
>;

export default SettingValues;
