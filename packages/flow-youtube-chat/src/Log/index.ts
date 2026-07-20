import {
  Array as A,
  Brand,
  Either as E,
  LogLevel,
  ParseResult,
  Schema as S,
  pipe,
} from 'effect';
import {
  compressToUTF16,
  decompressFromUTF16,
  compressToEncodedURIComponent,
  decompressFromEncodedURIComponent,
} from 'lz-string';

interface LogEntry {
  id: number
  text: string
  level: LogLevel.LogLevel['label']
}

type LogBlock = readonly LogEntry[];

type CompressedLogBlock = string & Brand.Brand<'CompressedLogBlock'>;

const makeCompressedLogBlock = Brand.nominal<CompressedLogBlock>();

type Log = {
  nextId: number
  compressedBlocks: readonly CompressedLogBlock[]
  lastBlock: LogBlock
} & Brand.Brand<'Log'>;

const makeLog = Brand.nominal<Log>();

export default Log;

type LogExportBlock = string;

interface LogExport {
  nextId: number
  blocks: A.NonEmptyReadonlyArray<LogExportBlock>
}

// The literals must stay assignable to LogLevel.LogLevel['label']; tsc
// checks that where decoded entries flow into LogBlock.
const logBlockJson = S.parseJson(S.Array(S.Struct({
  id: S.Number,
  text: S.String,
  level: S.Literal(
    'ALL',
    'FATAL',
    'ERROR',
    'WARN',
    'INFO',
    'DEBUG',
    'TRACE',
    'OFF',
  ),
})));

// Accepts unknown because lz-string decompression yields null on garbage.
const decodeLogBlock = S.decodeUnknownEither(logBlockJson);

const decodeLogExport = S.decodeEither(S.parseJson(S.Struct({
  nextId: S.Number,
  blocks: S.NonEmptyArray(S.String),
})));

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

// Trust boundary: the input is pasted text. Every block is decoded before
// anything is stored, so a malformed paste is a typed failure instead of a
// defect now or corrupted state that only explodes on a later read.
export const importLog = (
  s: string,
): E.Either<Log, ParseResult.ParseError> => pipe(
  s[0] === '<' ? s.slice(5, -6) : s,
  decodeLogExport,
  E.flatMap((logExport) => pipe(
    logExport.blocks,
    A.map(decompressFromEncodedURIComponent),
    (blocks): E.Either<
      Pick<Log, 'compressedBlocks' | 'lastBlock'>,
      ParseResult.ParseError
    > => A.matchRight(blocks, {
      onEmpty: () => E.right({
        compressedBlocks: [],
        lastBlock: [],
      }),
      onNonEmpty: (init, last) => E.all({
        compressedBlocks: pipe(
          init,
          A.map((x) => E.map(
            decodeLogBlock(x),
            () => makeCompressedLogBlock(compressToUTF16(x)),
          )),
          E.all,
        ),
        lastBlock: decodeLogBlock(last),
      }),
    }),
    E.map((blocks) => makeLog({
      nextId: logExport.nextId,
      ...blocks,
    })),
  )),
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
): Log => (i > log.compressedBlocks.length
  ? log
  : makeLog({
    nextId: log.nextId,
    ...(i === log.compressedBlocks.length
      ? {
        lastBlock: [],
        compressedBlocks: log.compressedBlocks,
      }
      : {
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
    (x) => (x.length === blockSize
      ? {
        compressedBlocks: A.append(
          log.compressedBlocks,
          makeCompressedLogBlock(compressToUTF16(JSON.stringify(x))),
        ),
        lastBlock: [],
      }
      : {
        compressedBlocks: log.compressedBlocks,
        lastBlock: x,
      }),
  ),
});
