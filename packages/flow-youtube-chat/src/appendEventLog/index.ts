import {
  flow,
} from '@effect/data/Function';
import * as logLevel from '@effect/io/Logger/Level';

import Log, * as log from '@/Log';
import maxEventLogBlockCount from '@/maxEventLogBlockCount';
import preserveEventLogBlockCount from '@/preserveEventLogBlockCount';

export default (
  text: string,
  level: logLevel.LogLevel['label'],
): (l: Log) => Log => flow(
  (x) => (x.compressedBlocks.length === maxEventLogBlockCount ? log.removeBlock(
    Math.floor(preserveEventLogBlockCount),
  )(x) : x),
  log.append(text, level),
);
