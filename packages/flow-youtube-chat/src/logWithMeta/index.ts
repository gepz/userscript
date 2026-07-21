import {
  Effect as Z,
  Option as O,
  LogLevel,
  pipe,
} from 'effect';

import LogMeta from '@/LogMeta';

export default (
  level: LogLevel.LogLevel,
) => (
  message: string,
) => (
  data: unknown,
): Z.Effect<void> => pipe(
  Z.log(message),
  Z.provideService(LogMeta, O.some(data)),
  (x) => LogLevel.locally(level)(x),
);
