import checkboxNode from '@userscript/ui/appNode/checkboxNode';

import AppCommander from '@/AppCommander';
import SettingState from '@/SettingState';
import TextKey from '@/TextKey';
import getText from '@/getText';
import SettingKeys from '@/settingUI/SettingKeys';
import computed from '@/settingUI/computed';
import getState from '@/settingUI/getState';
import updateBool from '@/settingUI/updateBool';

export default checkboxNode<
SettingState,
typeof computed,
AppCommander,
SettingKeys<boolean> & TextKey
>(updateBool, getText, getState);
