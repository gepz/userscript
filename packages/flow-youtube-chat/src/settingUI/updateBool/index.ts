import * as boolUpdater from '@userscript/ui/BoolUpdater';

import AppCommander from '@/AppCommander';
import SettingState from '@/SettingState';
import computed from '@/settingUI/computed';
import updateAt from '@/settingUI/updateAt';

export default boolUpdater.make<
SettingState,
typeof computed,
AppCommander
>(updateAt);
