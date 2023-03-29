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
import setEditColor from '@/settingUI/setEditColor';
import Editable, * as Ed from '@/ui/Editable';
import colorPicker from '@/ui/colorPicker';
import errorText from '@/ui/errorText';
import settingRow from '@/ui/settingRow';
import textInput from '@/ui/textInput';

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
    editAction(label, setEditColor)(c),
    (x) => [
      colorPicker(x)(Ed.value(s[label])),
      textInput(x)(s[label]),
    ],
  ),
);
