import * as Z from 'effect/Effect';
import {
  pipe,
} from 'effect/Function';
import Swal from 'sweetalert2';

import AppCommander from '@/AppCommander';
import * as log from '@/Log';
import SettingState from '@/SettingState';
import getText from '@/getText';

export default ({
  copy: () => (s) => Z.map(
    Z.promise(async () => GM.setClipboard(log.exportLog(s.eventLog))),
    () => s,
  ),
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  clearFlowChats: (c) => (s) => Z.map(
    c.act.clearFlowChats,
    () => s,
  ),
  importLog: () => (s) => pipe(
    Z.promise(() => Swal.fire<string>({
      input: 'textarea',
      inputLabel: getText('importLog')(s),
    })),
    Z.map((x) => (x.isConfirmed ? {
      ...s,
      eventLog: log.importLog(x.value ?? ''),
    } : s)),
  ),
}) satisfies Record<
string,
(c: AppCommander) => (s: SettingState) => Z.Effect<never, never, SettingState>
>;
