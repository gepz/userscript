import {
  Effect as Z,
  Record as R,
} from 'effect';

import GMConfig from '@/GMConfig';
import GMConfigItem from '@/GMConfigItem';

type UserConfig = {
  [P in keyof GMConfig]: GMConfig[P] extends GMConfigItem<infer R2> ? R2 : never;
};

export default UserConfig;

// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
export const makeConfig = (config: GMConfig): Z.Effect<UserConfig> => Z.all(
  R.map(config, (c) => c.getValue),
) as Z.Effect<UserConfig>;
