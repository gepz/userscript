import {
  flow,
  constant,
} from '@effect/data/Function';
import * as RA from '@effect/data/ReadonlyArray';
import * as Str from '@effect/data/String';
import * as P from 'fp-ts/Predicate';

export default flow(
  Str.split(/\r\n|\n/),
  RA.filter(P.not(Str.isEmpty)),
  constant,
);
