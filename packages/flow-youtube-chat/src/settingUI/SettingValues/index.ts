import AppPropertyValues from '@userscript/ui/AppPropertyValues';

import SettingState from '@/SettingState';
import computed from '@/settingUI/computed';

type SettingValues = AppPropertyValues<SettingState, typeof computed>;

export default SettingValues;
