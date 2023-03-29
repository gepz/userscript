import {
  pipe,
  constant,
} from '@effect/data/Function';
import * as O from '@effect/data/Option';
import * as Tu from '@effect/data/Tuple';

import Editable, * as Ed from '@/ui/Editable';

export default (
  editing: boolean,
) => (
  value: string,
) => (
  state: Editable<number>,
): Editable<number> => pipe(
  value,
  Number.parseFloat,
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
