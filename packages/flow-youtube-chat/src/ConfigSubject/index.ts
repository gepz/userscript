import * as RA from 'fp-ts/ReadonlyArray';
import {
  pipe,
} from 'fp-ts/function';
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
  RA.map((x) => [x, new Subject()]),
  Object.fromEntries,
);
