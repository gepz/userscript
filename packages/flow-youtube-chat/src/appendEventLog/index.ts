import {
  flow,
} from '@effect/data/Function';

import Log, * as log from '@/Log';

export default (
  text: string,
): (l: Log) => Log => flow(
  log.append(text),
  (x) => (x.entries.length > 1000 ? log.truncate(100)(x) : x),
);
