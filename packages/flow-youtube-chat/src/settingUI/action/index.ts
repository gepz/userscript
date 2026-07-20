import {
  Effect as Z,
  Either as E,
  pipe,
} from 'effect';
// import Swal from 'sweetalert2';

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
    // Z.promise(() => Swal.fire<string>({
    //   input: 'textarea',
    //   inputLabel: getText('importLog')(s),
    // })),
    // Z.map((x) => (x.isConfirmed ? {
    //   ...s,
    //   eventLog: log.importLog(x.value ?? ''),
    // } : s)),
    // eslint-disable-next-line no-alert
    Z.sync(() => prompt(getText('importLog')(s))),
    Z.flatMap(Z.fromNullable),
    Z.flatMap((x) => E.match(log.importLog(x), {
      onLeft: Z.fail,
      onRight: (eventLog) => Z.succeed({
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
