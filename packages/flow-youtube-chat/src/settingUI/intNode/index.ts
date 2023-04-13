import Editable from '@userscript/ui/Editable';
import errorText from '@userscript/ui/errorText';
import rangeRow from '@userscript/ui/rangeRow';
import setEditInt from '@userscript/ui/setter/setEditInt';
import settingRow from '@userscript/ui/settingRow';
import {
  VNode,
} from 'hyperapp';

import AppCommander from '@/AppCommander';
import SettingState from '@/SettingState';
import TextKey from '@/TextKey';
import getText from '@/getText';
import SettingKeys from '@/settingUI/SettingKeys';
import editAction from '@/settingUI/editAction';
import getState from '@/settingUI/getState';

export default (
  label: TextKey
  & SettingKeys<Editable<number>>,
  min: number,
  max: number,
  step: number,
) => (
  c: AppCommander,
) => (
  s: SettingState,
): VNode<SettingState> => settingRow(
  getText(label)(s.lang),
  errorText(getText('inputNonNumberic')(s.lang))(s[label]),
  [
    rangeRow(
      min,
      max,
      step,
      editAction<Editable<number>>(label, setEditInt)(c),
    )(getState<Editable<number>>(label)(s)),
  ],
);
