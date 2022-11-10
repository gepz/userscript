import * as En from 'fp-ts/Endomorphism';
import * as O from 'fp-ts/Option';
import * as R from 'fp-ts/Reader';
import {
  flow,
  constant,
} from 'fp-ts/function';

import Editable, * as Ed from '@/ui/Editable';

export default (
  editing: boolean,
): R.Reader<string, En.Endomorphism<Editable<string>>> => flow(
  (x) => constant(
    editing ? Ed.fromValueText(x)(x)
    : Ed.of(x),
  ),
);
