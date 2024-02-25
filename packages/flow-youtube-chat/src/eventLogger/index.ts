import * as Z from 'effect/Effect';
import * as Logger from 'effect/Logger';
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
) => Logger.make<unknown, void>(({
  logLevel,
  message,
}) => Z.runPromise(updateSettingState(apps.getValue())((s) => (s.logEvents ? ({
  ...s,
  eventLog: appendEventLog(
    String(message),
    logLevel.label,
  )(s.eventLog),
}) : s))));

