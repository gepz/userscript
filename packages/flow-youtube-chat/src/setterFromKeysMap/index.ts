import * as Z from 'effect/Effect';
import {
  pipe,
} from 'effect/Function';
import * as A from 'effect/Array';

import UserConfig from '@/UserConfig';
import UserConfigSetter from '@/UserConfigSetter';

export default (keys: (keyof UserConfig)[]) => (
  f: (k: keyof UserConfig) => (v: never) => Z.Effect<unknown>,
): UserConfigSetter => pipe(
  keys,
  A.map((x) => [x, f(x)]),
  Object.fromEntries,
);
