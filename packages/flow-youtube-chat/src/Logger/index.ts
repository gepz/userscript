import {
  Effect as Z,
  Array as A,
} from 'effect';

export default interface Logger {
  (as: A.NonEmptyReadonlyArray<unknown>): Z.Effect<void>,
}
