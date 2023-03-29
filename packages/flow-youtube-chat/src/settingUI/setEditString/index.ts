import {
  flow,
  constant,
} from '@effect/data/Function';
import * as En from 'fp-ts/Endomorphism';
import * as R from 'fp-ts/Reader';

import Editable, * as Ed from '@/ui/Editable';

export default (
  editing: boolean,
): R.Reader<string, En.Endomorphism<Editable<string>>> => flow(
  (x) => constant(
    editing ? Ed.fromValueText(x)(x)
    : Ed.of(x),
  ),
);
