import {
  apply,
  pipe,
  flip,
} from '@effect/data/Function';

import AppCommander from '@/AppCommander';
import SettingState from '@/SettingState';
import SettingDispatchable from '@/settingUI/SettingDispatchable';
import StateKey from '@/settingUI/StateKey';
import UpdateType from '@/settingUI/UpdateType';
import getState from '@/settingUI/getState';
import updateAt from '@/settingUI/updateAt';
import getValue from '@/ui/getValue';

export default <T extends UpdateType>(
  setter: (x: string) => (t: T) => T,
) => (
  key: StateKey<T>,
): (
    c: AppCommander
  ) => (s: SettingState, e: Event) => SettingDispatchable => flip(
  (s, e) => pipe(
    getValue(e),
    setter,
    apply(getState(key)(s)),
    updateAt(key),
    flip,
    apply(s),
  ),
);
