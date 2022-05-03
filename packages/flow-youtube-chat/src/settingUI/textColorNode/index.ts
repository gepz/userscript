import * as R from 'fp-ts/Reader';
import {
  pipe,
  identity,
} from 'fp-ts/function';
import {
  VNode,
} from 'hyperapp';

import SettingConfig from '@/SettingConfig';
import SettingState from '@/SettingState';
import TextByLang from '@/TextByLang';
import getText from '@/getText';
import StateKey from '@/settingUI/StateKey';
import editAction from '@/settingUI/editAction';
import exampleTextStyle from '@/settingUI/exampleTextStyle';
import getEditValue from '@/settingUI/getEditValue';
import updateString from '@/settingUI/updateString';
import colorInput from '@/ui/colorInput';
import colorPicker from '@/ui/colorPicker';
import colorTextOutput from '@/ui/colorTextOutput';
import settingRow from '@/ui/settingRow';
import textColorRow from '@/ui/textColorRow';

export default (
  label: keyof TextByLang
  & StateKey<string>,
): R.Reader<SettingConfig, VNode<SettingState>> => (
  c,
) => settingRow(getText(label)(c.state.lang), [
  textColorRow<SettingState>(pipe(
    editAction(label, updateString)(c),
    (x) => [
      colorPicker(x),
      colorInput(x),
      colorTextOutput(exampleTextStyle(c.state)),
    ],
  ))(getEditValue<string>(label, identity)(c.state)),
]);
