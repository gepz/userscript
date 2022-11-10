import * as R from 'fp-ts/Reader';
import {
  Effect,
} from 'hyperapp';

import SettingState from '@/SettingState';
import UserConfig from '@/UserConfig';
import UserConfigSetter from '@/UserConfigSetter';

export default <T extends keyof UserConfig>(
  k: T,
  v: UserConfig[T]['val'],
): R.Reader<UserConfigSetter, Effect<SettingState>> => (
  setConfig,
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
) => setConfig[k](v as never);
