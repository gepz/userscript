import * as Z from 'effect/Effect';
import {
  Effect,
} from 'hyperapp';

import AppCommander from '@/AppCommander';
import SettingState from '@/SettingState';
import UserConfig from '@/UserConfig';

export default <T extends keyof UserConfig>(
  k: T,
  v: UserConfig[T],
): (c: AppCommander) => Effect<SettingState> => (
  c,
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
) => () => Z.runPromise(c.provideLog(c.setConfig[k](v as never)));
