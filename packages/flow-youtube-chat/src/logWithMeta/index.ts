import {
  Effect as Z,
  Option as O,
  LogLevel,
} from 'effect';
import {
  pipe,
} from 'effect/Function';

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
