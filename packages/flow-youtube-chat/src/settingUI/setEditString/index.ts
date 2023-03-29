import {
  flow,
  constant,
} from '@effect/data/Function';
import * as En from 'fp-ts/Endomorphism';

import Editable, * as Ed from '@/ui/Editable';

export default (
  editing: boolean,
): (x: string) => En.Endomorphism<Editable<string>> => flow(
  (x) => constant(
    editing ? Ed.fromValueText(x)(x)
    : Ed.of(x),
  ),
);
