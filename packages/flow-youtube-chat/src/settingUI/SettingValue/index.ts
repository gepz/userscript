import AppPropertiesValue from '@userscript/ui/AppPropertiesValue';

import SettingState from '@/SettingState';
import SettingKey from '@/settingUI/SettingKey';
import computed from '@/settingUI/computed';

type SettingValue<K extends SettingKey<unknown>> = AppPropertiesValue<
SettingState,
typeof computed,
K
>;

export default SettingValue;
