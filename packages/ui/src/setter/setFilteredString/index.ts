import {
  Array as A,
  Option as O,
  String as Str,
} from 'effect';
import {
  pipe,
} from 'effect/Function';

import Setter from '@/setter/Setter';

const setFilteredString = <S extends string>(
  allowedStrings: readonly S[],
): Setter<string, S> => (value) => (state) => pipe(
  value,
  O.liftPredicate(
    (x): x is S => A.containsWith(Str.Equivalence)(allowedStrings, x),
  ),
  O.getOrElse(() => state),
);

export default setFilteredString;
