import {
  Effect as Z,
  Cause,
  Logger,
  LogLevel,
  Ref,
  pipe,
} from 'effect';
import {
  withMinimumLogLevel,
} from 'effect/Logger';
import {
  Dispatch,
} from 'hyperapp';

import LogAnnotationKeys from '@/LogAnnotationKeys';
import SettingState from '@/SettingState';
import eventLogger from '@/eventLogger';
import metaLogger from '@/metaLogger';

export default (
  settingUpdateApps: Ref.Ref<Dispatch<SettingState>[]>,
) => <T>(
  effect: Z.Effect<T>,
): Z.Effect<T> => pipe(
  Z.succeed(Logger.replace(
    Logger.defaultLogger,
    Logger.zip(metaLogger)(eventLogger(settingUpdateApps)),
  )),
  Z.flatMap((logLayer) => pipe(
    effect,
    Z.tapErrorCause((x) => Z.logError(Cause.pretty(x))),
    Z.provide(logLayer),
  )),
  Z.annotateLogs(LogAnnotationKeys.name, 'FYC'),
  withMinimumLogLevel(LogLevel.Debug),
);
