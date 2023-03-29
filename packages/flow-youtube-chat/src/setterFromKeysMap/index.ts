import {
  pipe,
} from '@effect/data/Function';
import * as RA from '@effect/data/ReadonlyArray';
import * as Z from '@effect/io/Effect';

import UserConfig from '@/UserConfig';
import UserConfigSetter from '@/UserConfigSetter';

export default (keys: (keyof UserConfig)[]) => (
  f: (k: keyof UserConfig) => (v: never) => Z.Effect<never, unknown, unknown>,
): UserConfigSetter => pipe(
  keys,
  RA.map((x) => [x, f(x)]),
  Object.fromEntries,
);
