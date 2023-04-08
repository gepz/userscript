import {
  flow,
  constant,
} from '@effect/data/Function';

import Editable, * as Ed from '@/ui/Editable';

export default (
  editing: boolean,
): (x: string) => (e: Editable<string>) => Editable<string> => flow(
  (x) => constant(
    editing ? Ed.fromValueText(x)(x)
    : Ed.of(x),
  ),
);
