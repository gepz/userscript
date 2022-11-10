import * as RA from 'fp-ts/ReadonlyArray';
import {
  pipe,
} from 'fp-ts/function';
import {
  Subject,
} from 'rxjs';

import ConfigItem from '@/ConfigItem';
import UserConfig from '@/UserConfig';

type ConfigSubject = {
  [P in keyof UserConfig]:
  UserConfig[P] extends ConfigItem<infer R> ? Subject<R>
  : never;
};

export default ConfigSubject;

export const makeSubject = (
  configKeys: (keyof UserConfig)[],
): ConfigSubject => pipe(
  configKeys,
  RA.map((x) => [x, new Subject()]),
  Object.fromEntries,
);
