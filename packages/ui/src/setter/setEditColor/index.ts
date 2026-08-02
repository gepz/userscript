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
    : Ed.setTextError(value)('')));

export default setEditColor;
