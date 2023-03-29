import * as O from '@effect/data/Option';
import * as FiberRef from '@effect/io/FiberRef';

type LogMeta = O.Option<unknown>;

export default LogMeta;

export const logMeta = FiberRef.unsafeMake<LogMeta>(O.none());
