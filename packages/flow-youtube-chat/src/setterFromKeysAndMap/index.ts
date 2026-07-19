import {
  Effect as Z,
  Record as R,
  pipe,
} from 'effect';

import UserConfig from '@/UserConfig';
import UserConfigSetter from '@/UserConfigSetter';

export default (keys: (keyof UserConfig)[]) => (
  f: <K extends keyof UserConfig>(k: K) => (v: UserConfig[K]) => Z.Effect<void>,
): UserConfigSetter => pipe(
  keys,
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  (ks) => R.fromIterableWith(ks, (k) => [k, f(k)]) as UserConfigSetter,
);
