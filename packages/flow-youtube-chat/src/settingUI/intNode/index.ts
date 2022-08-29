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
import setEditInt from '@/settingUI/setEditInt';
import * as Ed from '@/ui/Editable';
import errorText from '@/ui/errorText';
import rangeRow from '@/ui/rangeRow';
import settingRow from '@/ui/settingRow';

export default (
  label: TextKey
  & StateKey<Ed.Editable<number>>,
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
      editAction<Ed.Editable<number>>(label, setEditInt)(c),
    )(getState<Ed.Editable<number>>(label)(s)),
  ],
);
