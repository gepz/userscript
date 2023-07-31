import * as O from 'effect/Option';
import * as FiberRef from 'effect/FiberRef';

type LogMeta = O.Option<unknown>;

export default LogMeta;

export const logMeta = FiberRef.unsafeMake<LogMeta>(O.none());
