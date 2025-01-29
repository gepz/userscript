import {
  Array as A,
  Effect as Z,
  pipe,
} from 'effect';

import UserConfig from '@/UserConfig';
import UserConfigSetter from '@/UserConfigSetter';

export default (keys: (keyof UserConfig)[]) => (
  f: <K extends keyof UserConfig>(k: K) => (v: UserConfig[K]) => Z.Effect<void>,
): UserConfigSetter => pipe(
  keys,
  A.map((x) => [x, f(x)]),
  Object.fromEntries,
);
