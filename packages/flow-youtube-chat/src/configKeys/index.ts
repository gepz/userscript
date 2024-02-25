import UserConfig from '@/UserConfig';
import defaultGMConfig from '@/defaultGMConfig';

// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
export default Object.keys(defaultGMConfig) as (keyof UserConfig)[];

