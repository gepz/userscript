import {
  Effect as Z,
  Logger,
  Ref,
  pipe,
} from 'effect';

import appendEventLog from '@/appendEventLog';
import settingUpdateApps from '@/settingUpdateApps';
import updateSettingState from '@/updateSettingState';

export default Logger.make<unknown, void>(({
  logLevel,
  message,
}) => Z.runPromise(pipe(
  Ref.get(settingUpdateApps),
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
