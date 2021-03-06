import * as O from 'fp-ts/Option';
import * as R from 'fp-ts/Reader';
import {
  constant, pipe,
} from 'fp-ts/function';
import {
  VNode,
} from 'hyperapp';

import AppCommander from '@/AppCommander';
import SettingState from '@/SettingState';
import TextByLang from '@/TextByLang';
import getText from '@/getText';
import StateKey from '@/settingUI/StateKey';
import editAction from '@/settingUI/editAction';
import getState from '@/settingUI/getState';
import EditSetter from '@/ui/EditSetter';
import * as Ed from '@/ui/Editable';
import errorText from '@/ui/errorText';
import settingRow from '@/ui/settingRow';
import textAreaRow from '@/ui/textAreaRow';

export default (
  label: keyof TextByLang
  & StateKey<Ed.Editable<readonly string[]>>,
  rows: number,
  setter: EditSetter<Ed.Editable<readonly string[]>>,
): R.Reader<AppCommander, R.Reader<SettingState, VNode<SettingState>>> => (
  c,
) => (s) => settingRow(
  getText(label)(s.lang),
  errorText(getText('invalidSetting')(s.lang))(s[label]),
  [
    textAreaRow(
      rows,
      editAction<Ed.Editable<readonly string[]>>(label, setter)(c),
    )(getState<Ed.Editable<readonly string[]>>(label)(s)),
  ],
);
