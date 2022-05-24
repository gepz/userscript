import * as R from 'fp-ts/Reader';
import {
  pipe,
} from 'fp-ts/function';
import {
  VNode,
} from 'hyperapp';

import AppCommander from '@/AppCommander';
import SettingState from '@/SettingState';
import TextByLang from '@/TextByLang';
import getText from '@/getText';
import StateKey from '@/settingUI/StateKey';
import editAction from '@/settingUI/editAction';
import setEditColor from '@/settingUI/setEditColor';
import * as Ed from '@/ui/Editable';
import colorPicker from '@/ui/colorPicker';
import errorText from '@/ui/errorText';
import settingRow from '@/ui/settingRow';
import textInput from '@/ui/textInput';

export default (
  label: keyof TextByLang
  & StateKey<Ed.Editable<string>>,
): R.Reader<AppCommander, R.Reader<SettingState, VNode<SettingState>>> => (
  c,
) => (s) => settingRow(
  getText(label)(s.lang),
  errorText(getText('invalidColor')(s.lang))(s[label]),
  pipe(
    editAction(label, setEditColor)(c),
    (x) => [
      colorPicker(x)(Ed.value(s[label])),
      textInput(x)(s[label]),
    ],
  ),
);
