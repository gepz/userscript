import * as En from 'fp-ts/Endomorphism';
import * as O from 'fp-ts/Option';
import * as P from 'fp-ts/Predicate';
import * as RA from 'fp-ts/ReadonlyArray';
import {
  pipe,
  constant,
} from 'fp-ts/function';
import * as Str from 'fp-ts/string';

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
    editing ? [x, O.some([value, O.none])]
    : Ed.of(x),
  ),
);
