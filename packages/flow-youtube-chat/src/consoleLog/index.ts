import * as IO from 'fp-ts/IO';
import {
  pipe,
} from 'fp-ts/function';
import log from 'loglevel';

import Logger from '@/Logger';

export default (
  ...[a, ...b]: Parameters<Logger>
): IO.IO<void> => pipe(
  () => log.info(
    ...(typeof a === 'string' ? [`【FYC】 ${a}`]
    : ['【FYC】', a]),
  ),
  IO.apSecond(b.length > 0 ? () => log.info(...b)
  : () => {}),
);
