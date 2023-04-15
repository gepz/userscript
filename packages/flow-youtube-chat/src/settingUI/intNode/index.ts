import Editable from '@userscript/ui/Editable';
import errorText from '@userscript/ui/errorText';
import rangeRow from '@userscript/ui/node/rangeRow';
import settingRow from '@userscript/ui/node/settingRow';
import setEditInt from '@userscript/ui/setter/setEditInt';
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
      editAction(label, setEditInt)(c),
    )(getState(label)(s)),
  ],
);
