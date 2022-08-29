import UserConfig from '@/UserConfig';

type UserConfigSetter = {
  [P in keyof UserConfig]: (
    val: UserConfig[P]['val'],
  ) => Promise<void>;
};

export default UserConfigSetter;
