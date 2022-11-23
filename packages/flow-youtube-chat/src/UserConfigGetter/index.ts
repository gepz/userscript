import * as IO from 'fp-ts/IO';
import * as R from 'fp-ts/Reader';

import UserConfig from '@/UserConfig';
import mapObject from '@/mapObject';

type UserConfigGetter = {
  [P in keyof UserConfig]: IO.IO<UserConfig[P]['val']>;
};

export default UserConfigGetter;

export const makeGetter: R.Reader<UserConfig, UserConfigGetter> = mapObject(
  ([x, c]) => [x, () => c.val],
);
