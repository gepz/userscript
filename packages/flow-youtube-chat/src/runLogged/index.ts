import {
  Cause,
  Effect as Z,
  Layer,
  Logger,
  LogLevel,
  ManagedRuntime,
  pipe,
} from 'effect';

import eventLogger from '@/eventLogger';
import metaLogger from '@/metaLogger';

const runtime = ManagedRuntime.make(Layer.mergeAll(
  Logger.replace(
    Logger.defaultLogger,
    Logger.zip(metaLogger)(eventLogger),
  ),
  Logger.minimumLogLevel(LogLevel.Debug),
));

// Runs an effect at a detached root (the main entry, hyperapp event
// handlers, module-load effects) so it sees the log layer the main fiber
// tree inherits; failures and defects are logged before the promise
// rejects.
export default <T>(effect: Z.Effect<T>): Promise<T> => runtime.runPromise(pipe(
  effect,
  Z.tapErrorCause((x) => Z.logError(Cause.pretty(x))),
));
