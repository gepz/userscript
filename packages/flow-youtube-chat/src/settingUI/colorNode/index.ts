import * as R from 'fp-ts/Reader';
import * as RA from 'fp-ts/ReadonlyArray';
import {
  identity,
  pipe,
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
import getEditValue from '@/settingUI/getEditValue';
import updateString from '@/settingUI/updateString';
import colorInput from '@/ui/colorInput';
import colorPicker from '@/ui/colorPicker';
import settingRow from '@/ui/settingRow';
import textColorRow from '@/ui/textColorRow';

export default (
  label: keyof TextByLang
  & StateKey<string>,
): R.Reader<AppCommander, R.Reader<SettingState, VNode<SettingState>>> => (
  c,
) => (s) => settingRow(getText(label)(s.lang), [
  textColorRow(pipe(
    [
      colorPicker,
      colorInput,
    ],
    RA.map((f) => f(editAction(label, updateString)(c))),
  ))(getEditValue<string>(label, identity)(s)),
]);
