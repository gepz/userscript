import {
  Array as A,
  Effect as Z,
} from 'effect';
import {
  pipe,
} from 'effect/Function';

import UserConfig from '@/UserConfig';
import UserConfigSetter from '@/UserConfigSetter';

export default (keys: (keyof UserConfig)[]) => (
  f: (k: keyof UserConfig) => (v: never) => Z.Effect<unknown>,
): UserConfigSetter => pipe(
  keys,
  A.map((x) => [x, f(x)]),
  Object.fromEntries,
);
