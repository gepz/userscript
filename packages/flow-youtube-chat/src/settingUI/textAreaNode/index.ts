import EditSetter from '@userscript/ui/EditSetter';
import Editable from '@userscript/ui/Editable';
import errorText from '@userscript/ui/errorText';
import settingRow from '@userscript/ui/settingRow';
import textAreaRow from '@userscript/ui/textAreaRow';
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
  & SettingKeys<Editable<readonly string[]>>,
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
