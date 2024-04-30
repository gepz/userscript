import {
  Array as A,
  Brand,
  LogLevel,
} from 'effect';
import {
  pipe,
} from 'effect/Function';
import {
  compressToUTF16,
  decompressFromUTF16,
  compressToEncodedURIComponent,
  decompressFromEncodedURIComponent,
} from 'lz-string';

type LogEntry = {
  id: number,
  text: string,
  level: LogLevel.LogLevel['label'],
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

type LogExportBlock = string;

type LogExport = {
  nextId: number,
  blocks: A.NonEmptyReadonlyArray<LogExportBlock>,
};

export const decompressBlock = (x: CompressedLogBlock): LogBlock => pipe(
  decompressFromUTF16(x),
  JSON.parse,
);

export const exportLog = (x: Log): string => `<pre>${JSON.stringify({
  nextId: x.nextId,
  blocks: pipe(
    x.compressedBlocks,
    A.map(decompressFromUTF16),
    A.append(JSON.stringify(x.lastBlock)),
    A.map(compressToEncodedURIComponent),
  ),
} satisfies LogExport)}</pre>`;

export const importLog = (s: string): Log => makeLog(pipe(
  s[0] === '<' ? s.slice(5, -6) : s,
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  (x) => JSON.parse(x) as LogExport,
  (log) => ({
    nextId: log.nextId,
    ...pipe(
      log.blocks,
      A.map(decompressFromEncodedURIComponent),
      A.matchRight({
        onEmpty: () => ({
          compressedBlocks: [],
          lastBlock: [],
        }),
        onNonEmpty: (init, last) => ({
          compressedBlocks: A.map(
            init,
            (x) => pipe(
              compressToUTF16(x),
              makeCompressedLogBlock,
            ),
          ),
          // eslint-disable-next-line max-len
          // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
          lastBlock: JSON.parse(last) as LogBlock,
        }),
      }),
    ),
  }),
));

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
  ...(i === log.compressedBlocks.length ? {
    lastBlock: [],
    compressedBlocks: log.compressedBlocks,
  } : {
    lastBlock: log.lastBlock,
    compressedBlocks: A.remove(log.compressedBlocks, i),
  }),
}));

export const append = (
  text: string,
  level: LogLevel.LogLevel['label'],
) => (log: Log): Log => makeLog({
  nextId: log.nextId + 1,
  ...pipe(
    log.lastBlock,
    A.append({
      id: log.nextId,
      text,
      level,
    }),
    (x) => (x.length === blockSize ? {
      compressedBlocks: A.append(
        log.compressedBlocks,
        makeCompressedLogBlock(compressToUTF16(JSON.stringify(x))),
      ),
      lastBlock: [],
    } : {
      compressedBlocks: log.compressedBlocks,
      lastBlock: x,
    }),
  ),
});
