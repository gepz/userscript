import {
  pipe,
  constant,
} from 'effect/Function';
import * as P from 'effect/Predicate';
import * as RA from 'effect/ReadonlyArray';
import * as Str from 'effect/String';

import Setter from '@/setter/Setter';

const setStrings: Setter<string, readonly string[]> = (x) => pipe(
  Str.split(x, /\r\n|\n/),
  RA.filter(P.not(Str.isEmpty)),
  constant,
);

export default setStrings;

