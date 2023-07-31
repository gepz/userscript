import * as RA from 'effect/ReadonlyArray';
import * as Z from 'effect/Effect';

export default interface Logger {
  (as: RA.NonEmptyReadonlyArray<unknown>): Z.Effect<never, never, void>,
}
