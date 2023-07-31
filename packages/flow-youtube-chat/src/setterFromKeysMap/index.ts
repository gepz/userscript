import * as Z from 'effect/Effect';
import {
  pipe,
} from 'effect/Function';
import * as RA from 'effect/ReadonlyArray';

import UserConfig from '@/UserConfig';
import UserConfigSetter from '@/UserConfigSetter';

export default (keys: (keyof UserConfig)[]) => (
  f: (k: keyof UserConfig) => (v: never) => Z.Effect<never, never, unknown>,
): UserConfigSetter => pipe(
  keys,
  RA.map((x) => [x, f(x)]),
  Object.fromEntries,
);
