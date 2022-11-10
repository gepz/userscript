import * as T from 'fp-ts/Task';

import UserConfig from '@/UserConfig';

type UserConfigSetter = {
  [P in keyof UserConfig]: (
    val: UserConfig[P]['val'],
  ) => T.Task<void>;
};

export default UserConfigSetter;
