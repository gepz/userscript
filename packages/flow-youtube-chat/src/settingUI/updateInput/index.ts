import {
  apply,
  pipe,
} from '@effect/data/Function';
import * as En from 'fp-ts/Endomorphism';

import AppCommander from '@/AppCommander';
import SettingState from '@/SettingState';
import flip from '@/flip';
import SettingDispatchable from '@/settingUI/SettingDispatchable';
import StateKey from '@/settingUI/StateKey';
import UpdateType from '@/settingUI/UpdateType';
import getState from '@/settingUI/getState';
import updateAt from '@/settingUI/updateAt';
import getValue from '@/ui/getValue';

export default <T extends UpdateType>(
  setter: (x: string) => En.Endomorphism<T>,
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
