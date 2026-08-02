import {
  pipe,
} from 'effect/Function';

import Editable, * as Ed from '@/Editable';
import EditSetter from '@/setter/EditSetter';

const setEditNumber: EditSetter<Editable<number>> = (
  editing,
) => (
  value,
) => (
  state,
) => pipe(
  value,
  Number.parseFloat,
  editing
    ? (x) => (Number.isNaN(x) || value.at(-1) === '.'
      ? pipe(
        state,
        Ed.setText(value),
      )
      : Ed.fromValueText(x)(value))
    : (x) => (Number.isNaN(x)
      ? pipe(
        state,
        Ed.setTextError(value)(''),
      )
      : Ed.of(x)),
);

export default setEditNumber;
