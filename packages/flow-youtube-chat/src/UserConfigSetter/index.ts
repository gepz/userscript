import UserConfig from '@/UserConfig';

type Setter = {
  [P in keyof UserConfig]: (
    val: UserConfig[P]['val'],
  ) => Promise<void>;
};

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export default interface UserConfigSetter extends Setter {}
