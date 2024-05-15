import {
  Array as A,
  pipe,
} from 'effect';
import {
  Subject,
} from 'rxjs';

import UserConfig from '@/UserConfig';

type ConfigSubject = {
  [P in keyof UserConfig]: Subject<UserConfig[P]>;
};

export default ConfigSubject;

export const makeSubject = (
  configKeys: (keyof UserConfig)[],
): ConfigSubject => pipe(
  configKeys,
  A.map((x) => [x, new Subject()]),
  Object.fromEntries,
);
