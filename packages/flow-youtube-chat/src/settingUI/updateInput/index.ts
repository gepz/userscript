import * as inputUpdater from '@userscript/ui/InputUpdater';

import AppCommander from '@/AppCommander';
import SettingState from '@/SettingState';
import SettingKeys from '@/settingUI/SettingKeys';
import SettingValues from '@/settingUI/SettingValues';
import computed from '@/settingUI/computed';
import getState from '@/settingUI/getState';
import updateAt from '@/settingUI/updateAt';

export default inputUpdater.make<
SettingState,
typeof computed,
AppCommander,
SettingValues
// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
>(getState as <T extends SettingValues>(
  k: SettingKeys<T>
) => (s: SettingState) => T, updateAt);
