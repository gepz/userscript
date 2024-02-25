import * as inputUpdater from '@userscript/ui/InputUpdater';

import AppCommander from '@/AppCommander';
import SettingState from '@/SettingState';
import SettingProps from '@/settingUI/SettingProps';
import getState from '@/settingUI/getState';
import updateAt from '@/settingUI/updateAt';

export default inputUpdater.make<
SettingState,
SettingProps,
AppCommander
>(getState, updateAt);

