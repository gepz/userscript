import {
  pipe,
} from 'effect/Function';
import * as O from 'effect/Option';
import * as Z from 'effect/Effect';
import * as LogLevel from '@effect/io/Logger/Level';

import LogMeta, {
  logMeta,
} from '@/LogMeta';

export default (
  level: LogLevel.LogLevel,
) => (
  message: string,
) => (
  data: unknown,
): Z.Effect<never, never, void> => pipe(
  Z.log(message),
  Z.locally<LogMeta>(logMeta, O.some(data)),
  (x) => LogLevel.locally(level)(x),
);
