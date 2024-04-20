import * as Z from 'effect/Effect';
import * as A from 'effect/Array';

export default interface Logger {
  (as: A.NonEmptyReadonlyArray<unknown>): Z.Effect<void>,
}
