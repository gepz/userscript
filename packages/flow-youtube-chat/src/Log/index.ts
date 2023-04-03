import * as Brand from '@effect/data/Brand';
import {
  pipe,
} from '@effect/data/Function';
import * as RA from '@effect/data/ReadonlyArray';
import * as logLevel from '@effect/io/Logger/Level';
import {
  compress,
  decompress,
} from 'lz-string';

type LogEntry = {
  id: number,
  text: string,
  level: logLevel.LogLevel['label'],
};

type LogBlock = readonly LogEntry[];

type CompressedLogBlock = string & Brand.Brand<'CompressedLogBlock'>;

const makeCompressedLogBlock = Brand.nominal<CompressedLogBlock>();

type Log = {
  nextId: number,
  compressedBlocks: readonly CompressedLogBlock[],
  lastBlock: LogBlock,
} & Brand.Brand<'Log'>;

const makeLog = Brand.nominal<Log>();

export default Log;

export const decompressBlock = (x: CompressedLogBlock): LogBlock => pipe(
  decompress(x),
  JSON.parse,
);

export const blockSize = 200;

export const empty = (): Log => makeLog({
  nextId: 0,
  compressedBlocks: [],
  lastBlock: [],
});

export const removeBlock = (
  i: number,
) => (
  log: Log,
): Log => (i > log.compressedBlocks.length ? log : makeLog({
  nextId: log.nextId,
  ...i === log.compressedBlocks.length ? {
    lastBlock: [],
    compressedBlocks: log.compressedBlocks,
  } : {
    lastBlock: log.lastBlock,
    compressedBlocks: RA.remove(log.compressedBlocks, i),
  },
}));

export const append = (
  text: string,
  level: logLevel.LogLevel['label'],
) => (log: Log): Log => makeLog({
  nextId: log.nextId + 1,
  ...pipe(
    log.lastBlock,
    RA.append({
      id: log.nextId,
      text,
      level,
    }),
    (x) => (x.length === blockSize ? {
      compressedBlocks: RA.append(
        log.compressedBlocks,
        makeCompressedLogBlock(compress(JSON.stringify(x))),
      ),
      lastBlock: [],
    } : {
      compressedBlocks: log.compressedBlocks,
      lastBlock: x,
    }),
  ),
});
