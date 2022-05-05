import * as R from 'fp-ts/Reader';
import {
  VNode,
} from 'hyperapp';

import AppCommander from '@/AppCommander';
import SettingState from '@/SettingState';
import TextByLang from '@/TextByLang';
import getText from '@/getText';
import StateKey from '@/settingUI/StateKey';
import editAction from '@/settingUI/editAction';
import getEditValue from '@/settingUI/getEditValue';
import updateStrings from '@/settingUI/updateStrings';
import settingRow from '@/ui/settingRow';
import textAreaRow from '@/ui/textAreaRow';

export default (
  label: keyof TextByLang
  & StateKey<readonly string[]>,
  rows: number,
): R.Reader<AppCommander, R.Reader<SettingState, VNode<SettingState>>> => (
  c,
) => (s) => settingRow(getText(label)(s.lang), [
  textAreaRow(
    rows,
    getEditValue<readonly string[]>(label, (x) => x.join('\n'))(s),
    editAction(label, updateStrings)(c),
  ),
]);
