import {
  Option as O,
  Tuple as Tu,
} from 'effect';
import {
  constant,
} from 'effect/Function';

import Editable, * as Ed from '@/Editable';
import EditSetter from '@/setter/EditSetter';

const setEditColor: EditSetter<Editable<string>> = (
  editing,
) => (
  value,
) => (editing
  ? (CSS.supports('color', value)
    ? constant(Ed.fromValueText(value)(value))
    : Ed.setText(value))
  : (CSS.supports('color', value)
    ? constant(Ed.of(value))
    : Tu.mapSecond(constant(O.some([value, O.some('')])))));

export default setEditColor;
