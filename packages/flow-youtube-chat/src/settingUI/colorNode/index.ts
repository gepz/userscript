import {
  pipe,
} from '@effect/data/Function';
import Editable, * as Ed from '@userscript/ui/Editable';
import errorText from '@userscript/ui/errorText';
import colorPicker from '@userscript/ui/node/colorPicker';
import settingRow from '@userscript/ui/node/settingRow';
import textInput from '@userscript/ui/node/textInput';
import setEditColor from '@userscript/ui/setter/setEditColor';
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
