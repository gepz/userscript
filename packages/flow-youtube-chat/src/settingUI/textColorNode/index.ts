import * as R from 'fp-ts/Reader';
import {
  pipe,
} from 'fp-ts/function';
import {
  VNode,
} from 'hyperapp';

import AppCommander from '@/AppCommander';
import SettingState from '@/SettingState';
import TextKey from '@/TextKey';
import getText from '@/getText';
import StateKey from '@/settingUI/StateKey';
import editAction from '@/settingUI/editAction';
import exampleTextStyle from '@/settingUI/exampleTextStyle';
import setEditColor from '@/settingUI/setEditColor';
import Editable, * as Ed from '@/ui/Editable';
import colorPicker from '@/ui/colorPicker';
import colorTextOutput from '@/ui/colorTextOutput';
import errorText from '@/ui/errorText';
import settingRow from '@/ui/settingRow';
import textInput from '@/ui/textInput';

export default (
  label: TextKey
  & StateKey<Editable<string>>,
): R.Reader<AppCommander, R.Reader<SettingState, VNode<SettingState>>> => (
  c,
) => (s) => settingRow(
  getText(label)(s.lang),
  errorText(getText('invalidColor')(s.lang))(s[label]),
  pipe(
    {
      a: editAction(label, setEditColor)(c),
      v: Ed.value(s[label]),
    },
    ({
      a,
      v,
    }) => [
      colorPicker(a)(v),
      textInput(a)(s[label]),
      colorTextOutput<SettingState>(exampleTextStyle(s))(v),
    ],
  ),
);
