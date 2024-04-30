import {
  Array as A,
  Effect as Z,
} from 'effect';
import {
  pipe,
} from 'effect/Function';

import GMConfig from '@/GMConfig';
import GMConfigItem from '@/GMConfigItem';

type UserConfig = {
  [P in keyof GMConfig]: GMConfig[P] extends GMConfigItem<infer R> ? R : never;
};

export default UserConfig;

export const makeConfig = (
  config: GMConfig,
): Z.Effect<UserConfig> => pipe(
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  Object.entries(config) as [(keyof GMConfig), GMConfig[keyof GMConfig]][],
  A.map(([k, c]) => c.getValue.pipe(
    Z.map((x: UserConfig[keyof GMConfig]) => [k, x] as const),
  )),
  Z.all,
  Z.map<
  readonly(readonly [keyof UserConfig, UserConfig[keyof UserConfig]])[],
  UserConfig
  >(Object.fromEntries),
);
