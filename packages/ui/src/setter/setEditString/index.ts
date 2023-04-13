import {
  flow,
  constant,
} from '@effect/data/Function';

import Editable, * as Ed from '@/Editable';
import EditSetter from '@/setter/EditSetter';

const setEditString: EditSetter<Editable<string>> = (
  editing,
) => flow(
  (x) => constant(
    editing ? Ed.fromValueText(x)(x)
    : Ed.of(x),
  ),
);

export default setEditString;