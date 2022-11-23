import * as R from 'fp-ts/Reader';

import GMConfig from '@/GMConfig';
import mapObject from '@/mapObject';

type UserConfig = {
  [P in keyof GMConfig]: GMConfig[P]['val'];
};

export default UserConfig;

export const makeValue: R.Reader<GMConfig, UserConfig> = mapObject(
  ([x, c]) => [x, c.val],
);
