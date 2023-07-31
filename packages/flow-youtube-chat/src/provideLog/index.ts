import * as LogLevel from '@effect/io/Logger/Level';
import * as Cause from 'effect/Cause';
import * as Z from 'effect/Effect';
import {
  pipe,
} from 'effect/Function';
import * as Logger from 'effect/Logger';
import {
  withMinimumLogLevel,
} from 'effect/Logger';
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
  Z.flatMap((logLayer) => pipe(
    effect,
    Z.tapErrorCause((x) => Z.logError(Cause.pretty(x))),
    Z.provideSomeLayer(logLayer),
  )),
  Z.annotateLogs(LogAnnotationKeys.name, 'FYC'),
  withMinimumLogLevel(LogLevel.Debug),
);
