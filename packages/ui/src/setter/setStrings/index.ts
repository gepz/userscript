import * as A from 'effect/Array';
import {
  pipe,
  constant,
} from 'effect/Function';
import * as P from 'effect/Predicate';
import * as Str from 'effect/String';

import Setter from '@/setter/Setter';

const setStrings: Setter<string, readonly string[]> = (x) => pipe(
  Str.split(x, /\r\n|\n/),
  A.filter(P.not(Str.isEmpty)),
  constant,
);

export default setStrings;
