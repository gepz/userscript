import {
  Option as O,
  FiberRef,
} from 'effect';

type LogMeta = O.Option<unknown>;

export default LogMeta;

export const logMeta = FiberRef.unsafeMake<LogMeta>(O.none());
