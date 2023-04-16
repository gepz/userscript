import checkboxRow from '@userscript/ui/node/checkboxRow';
import {
  VNode,
} from 'hyperapp';

import AppCommander from '@/AppCommander';
import SettingState from '@/SettingState';
import TextKey from '@/TextKey';
import getText from '@/getText';
import SettingKeys from '@/settingUI/SettingKeys';
import getState from '@/settingUI/getState';
import updateBool from '@/settingUI/updateBool';

export default (
  label: TextKey
  & SettingKeys<boolean>,
): (c: AppCommander) => (s: SettingState) => VNode<SettingState> => (
  c,
) => (s) => checkboxRow(
  getText(label)(s),
  getState(label)(s),
  updateBool(label)(c),
);
