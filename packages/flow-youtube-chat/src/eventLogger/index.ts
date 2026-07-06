import {
  Effect as Z,
  Logger,
  Ref,
  pipe,
} from 'effect';
import {
  Dispatch,
} from 'hyperapp';

import SettingState from '@/SettingState';
import appendEventLog from '@/appendEventLog';
import updateSettingState from '@/updateSettingState';

export default (
  apps: Ref.Ref<Dispatch<SettingState>[]>,
) => Logger.make<unknown, void>(({
  logLevel,
  message,
}) => Z.runPromise(pipe(
  Ref.get(apps),
  Z.flatMap((x) => updateSettingState(x)((s) => (s.logEvents
    ? ({
      ...s,
      eventLog: appendEventLog(
        String(message),
        logLevel.label,
      )(s.eventLog),
    })
    : s))),
)));
