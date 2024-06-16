import {
  Array as A,
  Effect as Z,
  pipe,
} from 'effect';

import UserConfig from '@/UserConfig';
import UserConfigSetter from '@/UserConfigSetter';

export default (keys: (keyof UserConfig)[]) => (
  f: (k: keyof UserConfig) => (v: never) => Z.Effect<void>,
): UserConfigSetter => pipe(
  keys,
  A.map((x) => [x, f(x)]),
  Object.fromEntries,
);
