import {
  pipe,
} from '@effect/data/Function';
import * as RA from '@effect/data/ReadonlyArray';
import * as Z from '@effect/io/Effect';

import AppCommander from '@/AppCommander';
import SettingState from '@/SettingState';

export default ({
  copy: () => (s: SettingState) => Z.promise(async () => {
    GM.setClipboard(pipe(
      s.eventLog.entries,
      RA.map((x) => `${x.id}: ${x.text}`),
      RA.join('\n'),
    ));
  }),
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  clearFlowChats: (
    c: AppCommander,
  ) => () => c.act.clearFlowChats,
});
