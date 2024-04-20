import * as A from 'effect/Array';
import {
  pipe,
} from 'effect/Function';
import * as O from 'effect/Option';
import * as Str from 'effect/String';

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
