import * as R from 'fp-ts/Reader';
import {
  VNode,
} from 'hyperapp';

import SettingConfig from '@/SettingConfig';
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
): R.Reader<SettingConfig, VNode<SettingState>> => (c) => checkboxRow(
  getText(label)(c.state.lang),
  getState<boolean>(label)(c.state),
  updateBool(label)(c),
);
