import AppPropertiesKey from '@userscript/ui/AppPropertiesKey';

import SettingState from '@/SettingState';
import computed from '@/settingUI/computed';

type SettingKey<T> = AppPropertiesKey<SettingState, typeof computed, T>;

export default SettingKey;

