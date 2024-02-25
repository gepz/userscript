import * as Z from 'effect/Effect';

import UserConfig from '@/UserConfig';

type UserConfigSetter = {
  [P in keyof UserConfig]: (
    val: UserConfig[P],
  ) => Z.Effect<void>;
};

export default UserConfigSetter;

