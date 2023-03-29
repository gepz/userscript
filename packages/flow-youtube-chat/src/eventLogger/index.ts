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
  settingApps: BehaviorSubject<Dispatch<SettingState>[]>,
) => Logger.make<string, void>((
  fiberId,
  logLevel,
  message,
) => Z.runPromise(updateSettingState(
  settingApps.getValue(),
)((s) => ({
  ...s,
  eventLog: appendEventLog(message)(s.eventLog),
}))));
