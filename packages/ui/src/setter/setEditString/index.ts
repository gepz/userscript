import {
  constant,
} from 'effect/Function';

import Editable, * as Ed from '@/Editable';
import EditSetter from '@/setter/EditSetter';

const setEditString: EditSetter<Editable<string>> = (
  editing,
) => (x) => constant(
  editing ? Ed.fromValueText(x)(x)
  : Ed.of(x),
);

export default setEditString;
