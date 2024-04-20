import * as A from 'effect/Array';
import {
  pipe,
  constant,
} from 'effect/Function';
import * as O from 'effect/Option';
import * as P from 'effect/Predicate';
import * as Str from 'effect/String';

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
