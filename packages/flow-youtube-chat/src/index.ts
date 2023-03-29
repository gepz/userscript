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
  Z.bindValue(
    'settingUpdateApps',
    () => new BehaviorSubject<Dispatch<SettingState>[]>([]),
  ),
  Z.bindValue('provideLog', (x) => provideLog(x.settingUpdateApps)),
  Z.flatMap(initialize),
));
