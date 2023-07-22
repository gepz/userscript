import {
  pipe,
} from '@effect/data/Function';
import * as RA from '@effect/data/ReadonlyArray';
import * as Z from '@effect/io/Effect';

import GMConfig from '@/GMConfig';
import GMConfigItem from '@/GMConfigItem';

type UserConfig = {
  [P in keyof GMConfig]: GMConfig[P] extends GMConfigItem<infer R> ? R : never;
};

export default UserConfig;

export const makeConfig = (
  config: GMConfig,
): Z.Effect<never, never, UserConfig> => pipe(
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  Object.entries(config) as [(keyof GMConfig), GMConfig[keyof GMConfig]][],
  RA.map(([k, c]) => c.getValue.pipe(
    Z.map((x: UserConfig[keyof GMConfig]) => [k, x] as const),
  )),
  Z.all,
  Z.map<
  readonly(readonly [keyof UserConfig, UserConfig[keyof UserConfig]])[],
  UserConfig
  >(Object.fromEntries),
);
