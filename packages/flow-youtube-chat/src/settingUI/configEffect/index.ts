import * as Z from '@effect/io/Effect';
import {
  Effect,
} from 'hyperapp';

import SettingState from '@/SettingState';
import UserConfig from '@/UserConfig';
import UserConfigSetter from '@/UserConfigSetter';

export default <T extends keyof UserConfig>(
  k: T,
  v: UserConfig[T],
): (setter: UserConfigSetter) => Effect<SettingState> => (
  setConfig,
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
) => () => Z.runPromise(setConfig[k](v as never));
