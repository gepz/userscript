import UserConfig from '@/UserConfig';

type State = {
  [P in keyof UserConfig]: UserConfig[P]['val'];
};

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export default interface ConfigState extends State {}
