import {
  Effect as Z,
  Array as A,
} from 'effect';

type Logger = (as: A.NonEmptyReadonlyArray<unknown>) => Z.Effect<void>;

export default Logger;
