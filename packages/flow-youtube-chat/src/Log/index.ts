import * as Brand from '@effect/data/Brand';
import {
  pipe,
} from '@effect/data/Function';
import * as RA from '@effect/data/ReadonlyArray';

type LogEntry = {
  id: number,
  text: string,
};

type Log = {
  nextId: number,
  entries: readonly LogEntry[]
} & Brand.Brand<'Log'>;

const makeLog = Brand.nominal<Log>();

export default Log;

export const empty = (): Log => makeLog({
  nextId: 0,
  entries: [],
});

export const truncate = (
  preserveEntryCount: number,
) => (
  log: Log,
): Log => makeLog({
  nextId: log.nextId,
  entries: pipe(
    log.entries,
    RA.take(preserveEntryCount),
  ),
});

export const append = (text: string) => (log: Log): Log => makeLog({
  nextId: log.nextId + 1,
  entries: pipe(
    log.entries,
    RA.append({
      id: log.nextId,
      text,
    }),
  ),
});
