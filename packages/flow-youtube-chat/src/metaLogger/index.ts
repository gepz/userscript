import {
  Console,
  Context,
  DefaultServices,
  FiberRef,
  FiberRefs,
  Logger,
  LogLevel,
  Option as O,
  pipe,
} from 'effect';

import LogMeta from '@/LogMeta';

const consoleMethod = (
  x: LogLevel.LogLevel,
): 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'log' => (
  x === LogLevel.Trace
    ? 'trace'
    : x === LogLevel.Debug
      ? 'debug'
      : x === LogLevel.Info
        ? 'info'
        : x === LogLevel.Warning
          ? 'warn'
          : x === LogLevel.Error || x === LogLevel.Fatal
            ? 'error'
            : 'log');

export default Logger.make<unknown, void>(({
  logLevel,
  message,
  context,
}) => {
  const unsafeConsole = Context.get(
    FiberRefs.getOrDefault(context, DefaultServices.currentServices),
    Console.Console,
  ).unsafe;

  return pipe(
    Context.get(
      FiberRefs.getOrDefault(context, FiberRef.currentContext),
      LogMeta,
    ),
    O.match({
      onNone: () => (LogLevel.greaterThanEqual(LogLevel.Warning)(logLevel)
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        ? unsafeConsole[consoleMethod(logLevel)](`[FYC] ${message}`)
        : undefined),
      onSome: (meta) => unsafeConsole[consoleMethod(logLevel)](
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        `[FYC] ${message}: `,
        meta,
      ),
    }),
  );
});
