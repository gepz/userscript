import AppPropertyKeys from '@userscript/ui/AppPropertyKeys';

import SettingState from '@/SettingState';
import computed from '@/settingUI/computed';

type SettingKeys<T> = AppPropertyKeys<SettingState, typeof computed, T>;

export default SettingKeys;
