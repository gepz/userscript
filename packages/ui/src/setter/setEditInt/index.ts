import {
  Option as O,
  Tuple as Tu,
} from 'effect';
import {
  pipe,
  constant,
} from 'effect/Function';

import Editable, * as Ed from '@/Editable';
import EditSetter from '@/setter/EditSetter';

const setEditInt: EditSetter<Editable<number>> = (
  editing,
) => (
  value,
) => (
  state,
) => pipe(
  value,
  Number.parseInt,
  editing
    ? (x) => (Number.isNaN(x) || value.at(-1) === '.'
      ? pipe(
        state,
        Ed.setText(value),
      ) : Ed.fromValueText(x)(value))
    : (x) => (Number.isNaN(x)
      ? pipe(
        state,
        Tu.mapSecond(constant(O.some([value, O.some('')]))),
      ) : Ed.of(x)),
);

export default setEditInt;
