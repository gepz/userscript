import {
  Effect as Z,
  Option as O,
  LogLevel,
  pipe,
} from 'effect';

import LogMeta, {
  logMeta,
} from '@/LogMeta';

export default (
  level: LogLevel.LogLevel,
) => (
  message: string,
) => (
  data: unknown,
): Z.Effect<void> => pipe(
  Z.log(message),
  Z.locally<LogMeta>(logMeta, O.some(data)),
  (x) => LogLevel.locally(level)(x),
);
