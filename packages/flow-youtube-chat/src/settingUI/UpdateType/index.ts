import AppPropertyValues from '@userscript/ui/AppPropertyValues';

import SettingState from '@/SettingState';
import computed from '@/settingUI/computed';

type UpdateType = AppPropertyValues<SettingState, typeof computed>;

export default UpdateType;
