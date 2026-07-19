import {
  Effect as Z,
  Record as R,
  Struct,
} from 'effect';

import UserConfig from '@/UserConfig';

type UserConfigGetter = {
  [P in keyof UserConfig]: Z.Effect<UserConfig[P]>;
};

export default UserConfigGetter;

export const makeGetter = (
  c: UserConfig,
// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
): UserConfigGetter => R.fromIterableWith(
  Struct.keys(c),
  (k) => [k, Z.sync(() => c[k])],
) as UserConfigGetter;
