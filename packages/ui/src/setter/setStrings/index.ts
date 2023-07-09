import {
  pipe,
  constant,
} from '@effect/data/Function';
import * as P from '@effect/data/Predicate';
import * as RA from '@effect/data/ReadonlyArray';
import * as Str from '@effect/data/String';

import Setter from '@/setter/Setter';

const setStrings: Setter<string, readonly string[]> = (x) => pipe(
  Str.split(x, /\r\n|\n/),
  RA.filter(P.not(Str.isEmpty)),
  constant,
);

export default setStrings;
