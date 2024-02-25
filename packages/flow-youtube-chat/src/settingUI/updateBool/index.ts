import * as boolUpdater from '@userscript/ui/BoolUpdater';

import AppCommander from '@/AppCommander';
import SettingState from '@/SettingState';
import SettingProps from '@/settingUI/SettingProps';
import updateAt from '@/settingUI/updateAt';

export default boolUpdater.make<
SettingState,
SettingProps,
AppCommander
>(updateAt);

