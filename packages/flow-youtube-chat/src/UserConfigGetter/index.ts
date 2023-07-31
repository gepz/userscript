import * as Z from 'effect/Effect';
import {
  pipe,
} from 'effect/Function';

import UserConfig from '@/UserConfig';
import mapObject from '@/mapObject';

type UserConfigGetter = {
  [P in keyof UserConfig]: Z.Effect<never, never, UserConfig[P]>;
};

export default UserConfigGetter;

export const makeGetter = (c: UserConfig): UserConfigGetter => pipe(
  c,
  mapObject(([x]) => [x, Z.sync(() => c[x])]),
);
