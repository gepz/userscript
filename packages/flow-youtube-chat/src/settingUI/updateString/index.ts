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
import getValue from '@/ui/getValue';

export default (
  key: StateKey<string>,
): R.Reader<
  SettingConfig,
  (s: SettingState, e: Event) => SettingDispatchable
  > => flip(
  (_, e) => pipe(
    getValue(e),
    (x) => updateAt(key, x),
  ),
);
