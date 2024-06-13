import {
  Effect as Z,
  pipe,
} from 'effect';
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
  // eslint-disable-next-line func-names
  Z.gen(function* () {
    const settingUpdateApps = new BehaviorSubject<Dispatch<SettingState>[]>([]);
    yield* initialize({
      settingUpdateApps,
      provideLog: provideLog(settingUpdateApps),
    });
  }),
  Z.withConcurrency(30),
));
