import {
  constant,
} from '@effect/data/Function';
import * as O from '@effect/data/Option';
import * as Tu from '@effect/data/Tuple';

import Editable, * as Ed from '@/ui/Editable';
import validColor from '@/validColor';

export default (
  editing: boolean,
) => (
  value: string,
): (x: Editable<string>) => Editable<string> => (editing
  ? (validColor(value)
    ? constant(Ed.fromValueText(value)(value))
    : Ed.setText(value))
  : (validColor(value)
    ? constant(Ed.of(value))
    : Tu.mapSecond(constant(O.some([value, O.some('')])))));
