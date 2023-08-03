import {
  pipe,
} from 'effect/Function';
import * as HM from 'effect/HashMap';
import * as O from 'effect/Option';
import * as Z from 'effect/Effect';
import * as FiberRefs from 'effect/FiberRefs';
import * as Logger from 'effect/Logger';
import * as LogLevel from 'effect/LoggerLevel';

import LogAnnotationKeys from '@/LogAnnotationKeys';
import {
  logMeta,
} from '@/LogMeta';

const getConsoleLog = (
  x: LogLevel.LogLevel,
  // eslint-disable-next-line no-console
) => (x === LogLevel.Trace ? console.trace
// eslint-disable-next-line no-console
: x === LogLevel.Debug ? console.debug
// eslint-disable-next-line no-console
: x === LogLevel.Info ? console.info
// eslint-disable-next-line no-console
: x === LogLevel.Warning ? console.warn
// eslint-disable-next-line no-console
: x === LogLevel.Error || x === LogLevel.Fatal ? console.error
// eslint-disable-next-line no-console
: console.log).bind(console);

export default Logger.make<unknown, void>(({
  logLevel,
  message,
  context,
  annotations,
  // eslint-disable-next-line max-params, no-console
}) => Z.runPromise(pipe(
  () => `${pipe(
    annotations,
    HM.get(LogAnnotationKeys.name),
    O.match({
      onNone: () => '',
      onSome: (x) => `[${x}] `,
    }),
  )}${message}`,
  (getStr) => pipe(
    FiberRefs.getOrDefault(context, logMeta),
    (x) => x,
    O.match({
      onNone: () => (
        LogLevel.greaterThanEqual(LogLevel.Warning)(logLevel) ? Z.sync(
          () => getConsoleLog(logLevel)(getStr()),
        ) : Z.unit),
      onSome: (meta) => Z.sync(() => getConsoleLog(logLevel)(
        `${getStr()}: `,
        meta,
      )),
    }),
  ),
)));
