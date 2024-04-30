import {
  Array as A,
  Predicate as P,
  String as Str,
} from 'effect';
import {
  pipe,
  constant,
} from 'effect/Function';

import Setter from '@/setter/Setter';

const setStrings: Setter<string, readonly string[]> = (x) => pipe(
  Str.split(x, /\r\n|\n/),
  A.filter(P.not(Str.isEmpty)),
  constant,
);

export default setStrings;
