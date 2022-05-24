import UserConfig from '@/UserConfig';

type ConfigState = {
  [P in keyof UserConfig]: UserConfig[P]['val'];
};

export default ConfigState;
