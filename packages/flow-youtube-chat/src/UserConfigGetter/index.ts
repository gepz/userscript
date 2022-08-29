import UserConfig from '@/UserConfig';

type UserConfigGetter = {
  [P in keyof UserConfig]: () => UserConfig[P]['val'];
};

export default UserConfigGetter;
