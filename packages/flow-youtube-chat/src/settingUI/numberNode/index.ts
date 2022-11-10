import * as R from 'fp-ts/Reader';
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
import setEditNumber from '@/settingUI/setEditNumber';
import Editable from '@/ui/Editable';
import errorText from '@/ui/errorText';
import rangeRow from '@/ui/rangeRow';
import settingRow from '@/ui/settingRow';

export default (
  label: TextKey
  & StateKey<Editable<number>>,
  min: number,
  max: number,
  step: number,
): R.Reader<AppCommander, R.Reader<SettingState, VNode<SettingState>>> => (
  c,
) => (s) => settingRow(
  getText(label)(s.lang),
  errorText(getText('inputNonNumberic')(s.lang))(s[label]),
  [
    rangeRow(
      min,
      max,
      step,
      editAction<Editable<number>>(label, setEditNumber)(c),
    )(getState<Editable<number>>(label)(s)),
  ],
);
