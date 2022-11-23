import * as IO from 'fp-ts/IO';
import * as R from 'fp-ts/Reader';
import {
  pipe,
} from 'fp-ts/function';

import UserConfig from '@/UserConfig';
import mapObject from '@/mapObject';

type UserConfigGetter = {
  [P in keyof UserConfig]: IO.IO<UserConfig[P]>;
};

export default UserConfigGetter;

export const makeGetter: R.Reader<UserConfig, UserConfigGetter> = (c) => pipe(
  c,
  mapObject(([x]) => [x, () => c[x]]),
);
