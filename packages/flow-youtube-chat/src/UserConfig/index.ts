import {
  Effect as Z,
  Struct,
  pipe,
} from 'effect';

import GMConfig from '@/GMConfig';
import GMConfigItem from '@/GMConfigItem';

type UserConfig = {
  [P in keyof GMConfig]: GMConfig[P] extends GMConfigItem<infer R> ? R : never;
};

export default UserConfig;

export const makeConfig = (
  config: GMConfig,
): Z.Effect<UserConfig> => pipe(
  Struct.entries(config),
  Z.forEach(([k, c]) => c.getValue.pipe(
    Z.map((x: UserConfig[keyof GMConfig]) => [k, x] as const),
  )),
  Z.map<
    readonly(readonly [keyof UserConfig, UserConfig[keyof UserConfig]])[],
    UserConfig
  >(Object.fromEntries),
);
