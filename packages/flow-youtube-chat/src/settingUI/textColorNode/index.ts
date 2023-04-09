import {
  pipe,
} from '@effect/data/Function';
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
import Editable, * as Ed from '@userscript/ui/Editable';
import colorPicker from '@userscript/ui/colorPicker';
import colorTextOutput from '@userscript/ui/colorTextOutput';
import errorText from '@userscript/ui/errorText';
import settingRow from '@userscript/ui/settingRow';
import textInput from '@userscript/ui/textInput';

export default (
  label: TextKey
  & StateKey<Editable<string>>,
) => (
  c: AppCommander,
) => (
  s: SettingState,
): VNode<SettingState> => settingRow(
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
