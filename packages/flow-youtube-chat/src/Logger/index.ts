import * as IO from 'fp-ts/IO';
import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray';

export default interface Logger {
  (as: RNEA.ReadonlyNonEmptyArray<unknown>): IO.IO<void>,
}
