import {
  SubscriptionRef,
} from 'effect';

import UserConfig from '@/UserConfig';

type ConfigRefs = {
  [P in keyof UserConfig]: SubscriptionRef.SubscriptionRef<UserConfig[P]>;
};

export default ConfigRefs;
