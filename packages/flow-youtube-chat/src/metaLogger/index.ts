import {
  pipe,
} from '@effect/data/Function';
import * as HM from '@effect/data/HashMap';
import * as O from '@effect/data/Option';
import * as Z from '@effect/io/Effect';
import * as FiberRefs from '@effect/io/FiberRefs';
import * as Logger from '@effect/io/Logger';
import * as LogLevel from '@effect/io/Logger/Level';

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

export default Logger.make<string, void>((
  fiberId,
  logLevel,
  message,
  cause,
  context,
  span,
  annotations,
  // eslint-disable-next-line max-params, no-console
) => Z.runPromise(pipe(
  () => `${pipe(
    annotations,
    HM.get(LogAnnotationKeys.name),
    O.match(() => '', (x) => `[${x}] `),
  )}${message}`,
  (getStr) => pipe(
    FiberRefs.getOrDefault(context, logMeta),
    O.match(
      () => (LogLevel.greaterThanEqual(LogLevel.Info)(logLevel) ? Z.sync(
        () => getConsoleLog(logLevel)(getStr()),
      ) : Z.unit()),
      (meta) => Z.sync(() => getConsoleLog(logLevel)(
        `${getStr()}: `,
        meta,
      )),
    ),
  ),
)));
