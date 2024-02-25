import * as FiberRef from 'effect/FiberRef';
import * as O from 'effect/Option';

type LogMeta = O.Option<unknown>;

export default LogMeta;

export const logMeta = FiberRef.unsafeMake<LogMeta>(O.none());

