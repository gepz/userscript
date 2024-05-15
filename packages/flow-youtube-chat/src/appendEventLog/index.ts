import {
  LogLevel,
  pipe,
} from 'effect';

import Log, * as log from '@/Log';
import maxEventLogBlockCount from '@/maxEventLogBlockCount';
import preserveEventLogBlockCount from '@/preserveEventLogBlockCount';

export default (
  text: string,
  level: LogLevel.LogLevel['label'],
) => (x: Log): Log => pipe(
  x.compressedBlocks.length === maxEventLogBlockCount ? log.removeBlock(
    Math.floor(preserveEventLogBlockCount),
  )(x) : x,
  log.append(text, level),
);
