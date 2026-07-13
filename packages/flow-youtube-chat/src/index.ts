import {
  Effect as Z,
  Ref,
  pipe,
} from 'effect';
import {
  Dispatch,
} from 'hyperapp';

import SettingState from '@/SettingState';
import initialize from '@/initialize';
import provideLog from '@/provideLog';

Z.runPromise(pipe(
  Z.gen(function* () {
    const settingUpdateApps = yield * Ref.make<Dispatch<SettingState>[]>([]);
    yield * initialize({
      settingUpdateApps,
      provideLog: provideLog(settingUpdateApps),
    });
  }),
  Z.withConcurrency(30),
));
