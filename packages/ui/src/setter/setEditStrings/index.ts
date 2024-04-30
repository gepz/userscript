import {
  Array as A,
  Option as O,
  Predicate as P,
  String as Str,
} from 'effect';
import {
  pipe,
  constant,
} from 'effect/Function';

import Editable, * as Ed from '@/Editable';
import EditSetter from '@/setter/EditSetter';

const setEditStrings: EditSetter<Editable<readonly string[]>> = (
  editing,
) => (
  value,
) => pipe(
  value,
  Str.split(/\r\n|\n/),
  A.filter(P.not(Str.isEmpty)),
  (x) => constant(
    editing ? [x, O.some([value, O.none()])]
    : Ed.of(x),
  ),
);

export default setEditStrings;
