import {
  Effect as Z,
  Either as E,
  pipe,
} from 'effect';

import AppCommander from '@/AppCommander';
import * as log from '@/Log';
import SettingState from '@/SettingState';
import getText from '@/getText';

export default ({
  copy: () => (s) => Z.map(
    Z.promise(async () => GM.setClipboard(log.exportLog(s.eventLog))),
    () => s,
  ),

  clearFlowChats: (c) => (s) => Z.map(
    c.act.clearFlowChats,
    () => s,
  ),
  importLog: () => (s) => pipe(
    // eslint-disable-next-line no-alert
    Z.sync(() => prompt(getText('importLog')(s))),
    Z.flatMap(Z.fromNullable),
    Z.flatMap((x) => E.match(log.importLog(x), {
      onLeft: Z.fail,
      // Annotated so declaration emit writes the named type: the
      // inferred spread type spells out filterExp's jsep.Expression,
      // which tsc cannot name in a d.ts (TS4082).
      onRight: (eventLog) => Z.succeed<SettingState>({
        ...s,
        eventLog,
      }),
    })),
    Z.orElseSucceed(() => s),
  ),
}) satisfies Record<
  string,
  (c: AppCommander) => (s: SettingState) => Z.Effect<SettingState>
>;
