import * as R from 'fp-ts/Reader';
import {
  pipe,
  apply,
} from 'fp-ts/function';

import AppCommander from '@/AppCommander';
import SettingState from '@/SettingState';
import flip from '@/flip';
import SettingDispatchable from '@/settingUI/SettingDispatchable';
import StateKey from '@/settingUI/StateKey';
import updateAt from '@/settingUI/updateAt';
import getValue from '@/ui/getValue';

export default (
  key: StateKey<number>,
): R.Reader<
  AppCommander,
  (s: SettingState, e: Event) => SettingDispatchable
  > => flip(
  (s, e) => pipe(
    getValue(e),
    (x) => parseInt(x, 10),
    (x) => updateAt(key, x),
    flip,
    apply(s),
  ),
);
