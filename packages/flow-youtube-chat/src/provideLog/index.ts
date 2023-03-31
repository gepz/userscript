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
) => <T>(
  effect: Z.Effect<never, never, T>,
): Z.Effect<never, never, T> => pipe(
  Z.succeed(Logger.replace(
    Logger.defaultLogger,
    Logger.zip(metaLogger)(eventLogger(settingUpdateApps)),
  )),
  Z.flatMap((x) => pipe(
    effect,
    Z.provideSomeLayer(x),
  )),
  Z.logAnnotate(LogAnnotationKeys.name, 'FYC'),
  withMinimumLogLevel(LogLevel.Debug),
);
