import * as R from 'fp-ts/Reader';
import {
  VNode,
} from 'hyperapp';

import AppCommander from '@/AppCommander';
import SettingState from '@/SettingState';
import TextByLang from '@/TextByLang';
import getText from '@/getText';
import StateKey from '@/settingUI/StateKey';
import getState from '@/settingUI/getState';
import updateBool from '@/settingUI/updateBool';
import checkboxRow from '@/ui/checkboxRow';

export default (
  label: keyof TextByLang
  & StateKey<boolean>,
): R.Reader<AppCommander, R.Reader<SettingState, VNode<SettingState>>> => (
  c,
) => (s) => checkboxRow(
  getText(label)(s.lang),
  getState<boolean>(label)(s),
  updateBool(label)(c),
);
