import * as Z from 'effect/Effect';
import {
  pipe,
} from 'effect/Function';
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
  Z.Do,
  Z.let(
    'settingUpdateApps',
    () => new BehaviorSubject<Dispatch<SettingState>[]>([]),
  ),
  Z.let('provideLog', (x) => provideLog(x.settingUpdateApps)),
  Z.flatMap(initialize),
  Z.withConcurrency(30),
));

