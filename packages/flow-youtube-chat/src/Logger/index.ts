import * as RA from '@effect/data/ReadonlyArray';
import * as Z from '@effect/io/Effect';

export default interface Logger {
  (as: RA.NonEmptyReadonlyArray<unknown>): Z.Effect<never, never, void>,
}
