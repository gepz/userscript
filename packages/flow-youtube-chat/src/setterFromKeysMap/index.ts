import * as R from 'fp-ts/Reader';
import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import {
  pipe,
} from 'fp-ts/function';

import UserConfig from '@/UserConfig';
import UserConfigSetter from '@/UserConfigSetter';

export default (keys: (keyof UserConfig)[]) => (
  f: R.Reader<keyof UserConfig, R.Reader<never, T.Task<unknown>>>,
): UserConfigSetter => pipe(
  keys,
  RA.map((x) => [x, f(x)]),
  Object.fromEntries,
);
