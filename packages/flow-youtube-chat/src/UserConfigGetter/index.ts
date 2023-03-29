import {
  pipe,
} from '@effect/data/Function';
import * as Z from '@effect/io/Effect';

import UserConfig from '@/UserConfig';
import mapObject from '@/mapObject';

type UserConfigGetter = {
  [P in keyof UserConfig]: Z.Effect<never, never, UserConfig[P]>;
};

export default UserConfigGetter;

export const makeGetter = (c: UserConfig): UserConfigGetter => pipe(
  c,
  mapObject(([x]) => [x, () => c[x]]),
);
