import {
  apply,
  pipe,
  flip,
} from '@effect/data/Function';

import AppCommander from '@/AppCommander';
import SettingState from '@/SettingState';
import SettingDispatchable from '@/settingUI/SettingDispatchable';
import StateKey from '@/settingUI/StateKey';
import updateAt from '@/settingUI/updateAt';
import getChecked from '@userscript/ui/getChecked';

export default (
  key: StateKey<boolean>,
): (
    c: AppCommander
  ) => (s: SettingState, e: Event) => SettingDispatchable => flip(
  (s, e) => pipe(
    getChecked(e),
    updateAt(key),
    flip,
    apply(s),
  ),
);
