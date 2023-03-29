import {
  pipe,
  constant,
} from '@effect/data/Function';
import * as O from '@effect/data/Option';
import * as P from '@effect/data/Predicate';
import * as RA from '@effect/data/ReadonlyArray';
import * as Str from '@effect/data/String';
import * as En from 'fp-ts/Endomorphism';

import Editable, * as Ed from '@/ui/Editable';

export default (
  editing: boolean,
) => (
  value: string,
): En.Endomorphism<Editable<readonly string[]>> => pipe(
  value,
  Str.split(/\r\n|\n/),
  RA.filter(P.not(Str.isEmpty)),
  (x) => constant(
    editing ? [x, O.some([value, O.none()])]
    : Ed.of(x),
  ),
);
