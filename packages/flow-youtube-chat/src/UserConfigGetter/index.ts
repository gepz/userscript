import * as RA from 'fp-ts/ReadonlyArray';
import {
  pipe,
} from 'fp-ts/function';

import UserConfig from '@/UserConfig';

type UserConfigGetter = {
  [P in keyof UserConfig]: () => UserConfig[P]['val'];
};

export default UserConfigGetter;

export const makeGetter = (config: UserConfig): UserConfigGetter => pipe(
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  Object.keys(config) as (keyof UserConfig)[],
  RA.map((x) => [x, () => config[x].val]),
  Object.fromEntries,
);
