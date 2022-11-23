import * as IO from 'fp-ts/IO';
import * as O from 'fp-ts/Option';
import * as R from 'fp-ts/Reader';
import * as RA from 'fp-ts/ReadonlyArray';
import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray';
import * as S from 'fp-ts/State';
import {
  flow,
  apply,
  pipe,
} from 'fp-ts/function';

import Logger from '@/Logger';

export default <T>(
  log: Logger,
): R.Reader<S.State<unknown[][], IO.IO<T>>, IO.IO<T>> => flow(
  apply([]),
  ([io, logs]) => pipe(
    io,
    IO.apFirst(pipe(
      logs,
      RA.map(flow(
        RNEA.fromReadonlyArray,
        O.map(log),
        O.getOrElse(() => () => {}),
      )),
      IO.sequenceArray,
    )),
  ),
);
