import * as O from 'fp-ts/Option';
import * as RTu from 'fp-ts/ReadonlyTuple';
import {
  pipe,
  constant,
} from 'fp-ts/function';

import * as Ed from '@/ui/Editable';

export default (
  editing: boolean,
) => (
  value: string,
) => (
  state: Ed.Editable<number>,
): Ed.Editable<number> => pipe(
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
        RTu.mapSnd(constant(O.some([value, O.some('')]))),
      ) : Ed.of(x)),
);
