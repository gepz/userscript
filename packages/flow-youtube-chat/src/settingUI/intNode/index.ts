import * as R from 'fp-ts/Reader';
import * as N from 'fp-ts/number';
import {
  VNode,
} from 'hyperapp';

import AppCommander from '@/AppCommander';
import SettingConfig from '@/SettingConfig';
import SettingState from '@/SettingState';
import TextByLang from '@/TextByLang';
import getText from '@/getText';
import StateKey from '@/settingUI/StateKey';
import editAction from '@/settingUI/editAction';
import getEditValue from '@/settingUI/getEditValue';
import updateInt from '@/settingUI/updateInt';
import rangeRow from '@/ui/rangeRow';
import settingRow from '@/ui/settingRow';

export default (
  label: keyof TextByLang
  & StateKey<number>,
  min: number,
  max: number,
  step: number,
): R.Reader<AppCommander, R.Reader<SettingState, VNode<SettingState>>> => (
  c,
) => (s) => settingRow(getText(label)(s.lang), [
  rangeRow(
    min,
    max,
    step,
    getEditValue<number>(label, N.Show.show)(s),
    s.editingInput.id === label,
    editAction(label, updateInt)(c),
  ),
]);
