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
