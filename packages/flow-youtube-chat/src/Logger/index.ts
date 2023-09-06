import * as Z from 'effect/Effect';
import * as RA from 'effect/ReadonlyArray';

export default interface Logger {
  (as: RA.NonEmptyReadonlyArray<unknown>): Z.Effect<never, never, void>,
}
