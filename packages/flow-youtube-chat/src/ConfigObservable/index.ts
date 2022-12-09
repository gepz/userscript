import {
  Observable,
} from 'rxjs';

import UserConfig from '@/UserConfig';

type ConfigObservable = {
  [P in keyof UserConfig]: Observable<UserConfig[P]>;
};

export default ConfigObservable;
