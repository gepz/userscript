import {
  pipe,
} from '@effect/data/Function';
import * as Z from '@effect/io/Effect';
import {
  Dispatch,
} from 'hyperapp';
import {
  BehaviorSubject,
} from 'rxjs';

import SettingState from '@/SettingState';
import initialize from '@/initialize';
import provideLog from '@/provideLog';

Z.runPromise(pipe(
  Z.Do(),
  Z.letDiscard(
    'settingUpdateApps',
    new BehaviorSubject<Dispatch<SettingState>[]>([]),
  ),
  Z.let('provideLog', (x) => provideLog(x.settingUpdateApps)),
  Z.flatMap(initialize),
  Z.withParallelismUnbounded,
));
