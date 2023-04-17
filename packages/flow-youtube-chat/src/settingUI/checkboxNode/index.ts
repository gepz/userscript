import checkboxNode from '@userscript/ui/appNode/checkboxNode';

import AppCommander from '@/AppCommander';
import SettingState from '@/SettingState';
import TextKey from '@/TextKey';
import getText from '@/getText';
import SettingKey from '@/settingUI/SettingKey';
import SettingProps from '@/settingUI/SettingProps';
import getState from '@/settingUI/getState';
import updateBool from '@/settingUI/updateBool';

export default checkboxNode<
SettingState,
SettingProps,
AppCommander,
SettingKey<boolean> & TextKey
>(getText, getState, updateBool);
