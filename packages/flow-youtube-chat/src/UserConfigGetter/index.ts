import UserConfig from '@/UserConfig';

type Getter = {
  [P in keyof UserConfig]: () => UserConfig[P]['val'];
};

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export default interface UserConfigGetter extends Getter {}
