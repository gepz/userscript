import * as IO from 'fp-ts/IO';
import {
  flow,
  pipe,
} from 'fp-ts/function';

export default (
  addEnemyFn: IO.IO<number>,
) => (
  addLevelTeleporterFn: IO.IO<number>,
): IO.IO<unknown> => pipe(
  IO.Do,
  flow(
    IO.apS('enemy', addEnemyFn),
    IO.apS('nextLevelPortal', addLevelTeleporterFn),
  ),
);
