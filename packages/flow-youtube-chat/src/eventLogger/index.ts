import * as Z from '@effect/io/Effect';
import * as Logger from '@effect/io/Logger';
import {
  Dispatch,
} from 'hyperapp';
import {
  BehaviorSubject,
} from 'rxjs';

import SettingState from '@/SettingState';
import appendEventLog from '@/appendEventLog';
import updateSettingState from '@/updateSettingState';

export default (
  apps: BehaviorSubject<Dispatch<SettingState>[]>,
) => Logger.make<string, void>((
  fiberId,
  logLevel,
  message,
) => Z.runPromise(updateSettingState(apps.getValue())((s) => (s.logEvents ? ({
  ...s,
  eventLog: appendEventLog(
    message,
    logLevel.label,
  )(s.eventLog),
}) : s))));
