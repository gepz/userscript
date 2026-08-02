import {
  Array as A,
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
    editing
      ? Ed.fromValueText(x)(value)
      : Ed.of(x),
  ),
);

export default setEditStrings;
