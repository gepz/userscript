import {
  VNode,
} from 'hyperapp';

import AppCommander from '@/AppCommander';
import SettingState from '@/SettingState';
import TextKey from '@/TextKey';
import getText from '@/getText';
import StateKey from '@/settingUI/StateKey';
import getState from '@/settingUI/getState';
import updateBool from '@/settingUI/updateBool';
import checkboxRow from '@/ui/checkboxRow';

export default (
  label: TextKey
  & StateKey<boolean>,
): (c: AppCommander) => (s: SettingState) => VNode<SettingState> => (
  c,
) => (s) => checkboxRow(
  getText(label)(s.lang),
  getState<boolean>(label)(s),
  updateBool(label)(c),
);
