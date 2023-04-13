import {
  pipe,
} from '@effect/data/Function';
import Editable, * as Ed from '@userscript/ui/Editable';
import colorPicker from '@userscript/ui/colorPicker';
import errorText from '@userscript/ui/errorText';
import setEditColor from '@userscript/ui/setter/setEditColor';
import settingRow from '@userscript/ui/settingRow';
import textInput from '@userscript/ui/textInput';
import {
  VNode,
} from 'hyperapp';

import AppCommander from '@/AppCommander';
import SettingState from '@/SettingState';
import TextKey from '@/TextKey';
import getText from '@/getText';
import SettingKeys from '@/settingUI/SettingKeys';
import editAction from '@/settingUI/editAction';

export default (
  label: TextKey
  & SettingKeys<Editable<string>>,
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
