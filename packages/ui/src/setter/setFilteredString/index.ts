import {
  pipe,
} from '@effect/data/Function';
import * as O from '@effect/data/Option';
import * as RA from '@effect/data/ReadonlyArray';
import * as Str from '@effect/data/String';

import Setter from '@/setter/Setter';

const setFilteredString = <S extends string>(
  allowedStrings: readonly S[],
): Setter<string, S> => (value) => (state) => pipe(
  value,
  O.liftPredicate(
    (x): x is S => RA.containsWith(Str.Equivalence)(allowedStrings, x),
  ),
  O.getOrElse(() => state),
);

export default setFilteredString;
