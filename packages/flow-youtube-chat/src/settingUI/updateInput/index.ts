import * as inputUpdater from '@userscript/ui/InputUpdater';

import AppCommander from '@/AppCommander';
import SettingState from '@/SettingState';
import computed from '@/settingUI/computed';
import getState from '@/settingUI/getState';
import updateAt from '@/settingUI/updateAt';

export default inputUpdater.make<
SettingState,
typeof computed,
AppCommander
>(getState, updateAt);
