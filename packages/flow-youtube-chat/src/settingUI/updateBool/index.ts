import {
  apply,
  pipe,
  flip,
} from '@effect/data/Function';
import getChecked from '@userscript/ui/getChecked';

import AppCommander from '@/AppCommander';
import SettingState from '@/SettingState';
import SettingDispatchable from '@/settingUI/SettingDispatchable';
import SettingKeys from '@/settingUI/SettingKeys';
import updateAt from '@/settingUI/updateAt';

export default (
  key: SettingKeys<boolean>,
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
