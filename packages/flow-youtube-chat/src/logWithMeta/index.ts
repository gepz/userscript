import {
  pipe,
} from '@effect/data/Function';
import * as O from '@effect/data/Option';
import * as Z from '@effect/io/Effect';
import * as FiberRef from '@effect/io/FiberRef';
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
  FiberRef.locally<LogMeta>(logMeta, O.some(data)),
  (x) => LogLevel.locally(level)(x),
);
