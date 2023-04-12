import {
  apply,
  pipe,
} from '@effect/data/Function';
import getValue from '@userscript/ui/getValue';

import AppCommander from '@/AppCommander';
import SettingState from '@/SettingState';
import SettingDispatchable from '@/settingUI/SettingDispatchable';
import StateKey from '@/settingUI/StateKey';
import UpdateType from '@/settingUI/UpdateType';
import getState from '@/settingUI/getState';
import updateAt from '@/settingUI/updateAt';

export default <T extends UpdateType>(
  setter: (x: string) => (t: T) => T,
) => (
  key: StateKey<T>,
) => (
  c: AppCommander,
) => (
  s: SettingState,
  e: Event,
): SettingDispatchable => pipe(
  getValue(e),
  setter,
  apply(getState(key)(s)),
  updateAt(key),
  (x) => x(c)(s),
);
