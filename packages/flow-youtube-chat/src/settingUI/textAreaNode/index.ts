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
import EditSetter from '@/ui/EditSetter';
import Editable from '@/ui/Editable';
import errorText from '@/ui/errorText';
import settingRow from '@/ui/settingRow';
import textAreaRow from '@/ui/textAreaRow';

export default (
  label: TextKey
  & StateKey<Editable<readonly string[]>>,
  rows: number,
  setter: EditSetter<Editable<readonly string[]>>,
) => (
  c: AppCommander,
) => (
  s: SettingState,
): VNode<SettingState> => settingRow(
  getText(label)(s.lang),
  errorText(getText('invalidSetting')(s.lang))(s[label]),
  [
    textAreaRow(
      rows,
      editAction<Editable<readonly string[]>>(label, setter)(c),
    )(getState<Editable<readonly string[]>>(label)(s)),
  ],
);
