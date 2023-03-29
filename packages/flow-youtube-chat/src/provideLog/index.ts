import {
  pipe,
} from '@effect/data/Function';
import * as Z from '@effect/io/Effect';
import * as Logger from '@effect/io/Logger';
import {
  withMinimumLogLevel,
} from '@effect/io/Logger';
import * as LogLevel from '@effect/io/Logger/Level';
import {
  Dispatch,
} from 'hyperapp';
import {
  BehaviorSubject,
} from 'rxjs';

import LogAnnotationKeys from '@/LogAnnotationKeys';
import SettingState from '@/SettingState';
import eventLogger from '@/eventLogger';
import metaLogger from '@/metaLogger';

export default (
  settingUpdateApps: BehaviorSubject<Dispatch<SettingState>[]>,
) => (
  effect: Z.Effect<never, never, void>,
): Z.Effect<never, never, void> => pipe(
  Z.succeed(Logger.replace(
    Logger.defaultLogger,
    Logger.zip(metaLogger)(eventLogger(settingUpdateApps)),
  )),
  Z.tap((x) => pipe(
    effect,
    Z.provideSomeLayer(x),
  )),
  Z.logAnnotate(LogAnnotationKeys.name, 'FYC'),
  withMinimumLogLevel(LogLevel.Debug),
  Z.catchAllCause((x) => Z.logInfoCauseMessage('Defect', x)),
);
