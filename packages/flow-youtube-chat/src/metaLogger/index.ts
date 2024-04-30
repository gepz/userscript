import {
  Effect as Z,
  Option as O,
  Logger,
  LogLevel,
  Console,
  FiberRefs,
  HashMap as HM,
} from 'effect';
import {
  pipe,
} from 'effect/Function';

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
          : Z.void),
      onSome: (meta) => Z.sync(() => getConsoleLog(logLevel)(
        `${getStr()}: `,
        meta,
      )),
    }),
  ),
)));
