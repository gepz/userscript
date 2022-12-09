import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import {
  pipe,
} from 'fp-ts/function';

import GMConfig from '@/GMConfig';
import GMConfigItem from '@/GMConfigItem';

type UserConfig = {
  [P in keyof GMConfig]: GMConfig[P] extends GMConfigItem<infer R> ? R : never;
};

export default UserConfig;

export const makeConfig = (config: GMConfig): T.Task<UserConfig> => pipe(
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  Object.entries(config) as [(keyof GMConfig), GMConfig[keyof GMConfig]][],
  RA.map(([x, c]) => async () => [x, await c.getValue()] as const),
  T.sequenceArray,
  T.map<
  readonly (readonly [keyof UserConfig, UserConfig[keyof UserConfig]])[],
  UserConfig
  >(Object.fromEntries),
);
