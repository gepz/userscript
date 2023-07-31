import {
  constant,
} from 'effect/Function';
import * as O from 'effect/Option';
import * as Tu from 'effect/Tuple';
import validateColor from 'validate-color';

import Editable, * as Ed from '@/Editable';
import EditSetter from '@/setter/EditSetter';

const setEditColor: EditSetter<Editable<string>> = (
  editing,
) => (
  value,
) => (editing ? (validateColor(value)
  ? constant(Ed.fromValueText(value)(value))
  : Ed.setText(value))
: (validateColor(value)
  ? constant(Ed.of(value))
  : Tu.mapSecond(constant(O.some([value, O.some('')])))));

export default setEditColor;
