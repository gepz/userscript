import {
  Subject,
} from 'rxjs';

import ConfigItem from '@/ConfigItem';
import UserConfig from '@/UserConfig';

type S = {
  [P in keyof UserConfig]:
  UserConfig[P] extends ConfigItem<infer R> ? Subject<R>
  : never;
};

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export default interface ConfigSubject extends S {}
