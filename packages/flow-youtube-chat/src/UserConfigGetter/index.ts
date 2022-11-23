import * as IO from 'fp-ts/IO';
import * as R from 'fp-ts/Reader';

import GMConfig from '@/GMConfig';
import UserConfig from '@/UserConfig';
import mapObject from '@/mapObject';

type UserConfigGetter = {
  [P in keyof UserConfig]: IO.IO<UserConfig[P]>;
};

export default UserConfigGetter;

export const makeGetter: R.Reader<GMConfig, UserConfigGetter> = mapObject(
  ([x, c]) => [x, () => c.val],
);
