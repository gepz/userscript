import {
  VNode,
} from 'hyperapp';

import AppCommander from '@/AppCommander';
import SettingState from '@/SettingState';
import TextKey from '@/TextKey';
import getText from '@/getText';
import StateKey from '@/settingUI/StateKey';
import editAction from '@/settingUI/editAction';
import getState from '@/settingUI/getState';
import setEditInt from '@/settingUI/setEditInt';
import Editable from '@userscript/ui/Editable';
import errorText from '@userscript/ui/errorText';
import rangeRow from '@userscript/ui/rangeRow';
import settingRow from '@userscript/ui/settingRow';

export default (
  label: TextKey
  & StateKey<Editable<number>>,
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
