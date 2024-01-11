import * as Console from 'effect/Console';
import * as Z from 'effect/Effect';
import * as FiberRefs from 'effect/FiberRefs';
import {
  pipe,
} from 'effect/Function';
import * as HM from 'effect/HashMap';
import * as LogLevel from 'effect/LogLevel';
import * as Logger from 'effect/Logger';
import * as O from 'effect/Option';

import LogAnnotationKeys from '@/LogAnnotationKeys';
import {
  logMeta,
} from '@/LogMeta';

const getConsoleLog = (
  x: LogLevel.LogLevel,
  // eslint-disable-next-line no-console
) => (x === LogLevel.Trace ? Console.trace
: x === LogLevel.Debug ? Console.debug
: x === LogLevel.Info ? Console.info
: x === LogLevel.Warning ? Console.warn
: x === LogLevel.Error || x === LogLevel.Fatal ? Console.error
: Console.log);

export default Logger.make<unknown, void>(({
  logLevel,
  message,
  context,
  annotations,
}) => Z.runPromise(pipe(
  () => `${pipe(
    annotations,
    HM.get(LogAnnotationKeys.name),
    O.match({
      onNone: () => '',
      // eslint-disable-next-line max-len
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      onSome: (x) => `[${x}] `,
    }),
  // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
  )}${message}`,
  (getStr) => pipe(
    FiberRefs.getOrDefault(context, logMeta),
    O.match({
      onNone: () => (
        LogLevel.greaterThanEqual(LogLevel.Warning)(logLevel)
          ? getConsoleLog(logLevel)(getStr())
          : Z.unit),
      onSome: (meta) => Z.sync(() => getConsoleLog(logLevel)(
        `${getStr()}: `,
        meta,
      )),
    }),
  ),
)));
