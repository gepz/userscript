import {
  pipe,
} from '@effect/data/Function';
import Editable, * as Ed from '@userscript/ui/Editable';
import colorTextOutput from '@userscript/ui/colorTextOutput';
import errorText from '@userscript/ui/errorText';
import colorPicker from '@userscript/ui/node/colorPicker';
import settingRow from '@userscript/ui/node/settingRow';
import textInput from '@userscript/ui/node/textInput';
import setEditColor from '@userscript/ui/setEditColor';
import {
  VNode,
} from 'hyperapp';

import AppCommander from '@/AppCommander';
import SettingState from '@/SettingState';
import TextKey from '@/TextKey';
import getText from '@/getText';
import SettingKeys from '@/settingUI/SettingKeys';
import editAction from '@/settingUI/editAction';
import exampleTextStyle from '@/settingUI/exampleTextStyle';
import getState from '@/settingUI/getState';

export default (
  label: TextKey
  & SettingKeys<Editable<string>>,
) => (
  c: AppCommander,
) => (
  s: SettingState,
): VNode<SettingState> => settingRow(
  getText(label)(s),
  errorText(getText('invalidColor')(s))(getState(label)(s)),
  pipe(
    {
      a: editAction(label, setEditColor)(c),
      v: Ed.value(getState(label)(s)),
    },
    ({
      a,
      v,
    }) => [
      colorPicker(a)(v),
      textInput(a)(getState(label)(s)),
      colorTextOutput<SettingState>(exampleTextStyle(s))(v),
    ],
  ),
);
