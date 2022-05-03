import * as R from 'fp-ts/Reader';
import {
  pipe,
} from 'fp-ts/function';

import SettingConfig from '@/SettingConfig';
import SettingState from '@/SettingState';
import flip from '@/flip';
import SettingDispatchable from '@/settingUI/SettingDispatchable';
import StateKey from '@/settingUI/StateKey';
import updateAt from '@/settingUI/updateAt';
import getChecked from '@/ui/getChecked';

export default (
  key: StateKey<boolean>,
): R.Reader<
  SettingConfig,
  (s: SettingState, e: Event) => SettingDispatchable
  > => flip(
  (s, e) => pipe(
    getChecked(e),
    (x) => updateAt(key, x),
  ),
);
