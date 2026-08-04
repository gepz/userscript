import {
  LogLevel,
  pipe,
} from 'effect';

import Log, * as log from '@/Log';

const maxEntries = 10000;
const maxBlockCount = Math.floor(maxEntries / log.blockSize);
const preserveRatio = 0.2;
// removeBlock takes a whole block count, so floor the fractional product.
const preserveBlockCount = Math.floor(maxBlockCount * preserveRatio);

export default (
  text: string,
  level: LogLevel.LogLevel['label'],
) => (x: Log): Log => pipe(
  x.compressedBlocks.length === maxBlockCount
    ? log.removeBlock(preserveBlockCount)(x)
    : x,
  log.append(text, level),
);
