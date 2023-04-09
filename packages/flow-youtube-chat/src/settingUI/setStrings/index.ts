import {
  flow,
  constant,
} from '@effect/data/Function';
import * as P from '@effect/data/Predicate';
import * as RA from '@effect/data/ReadonlyArray';
import * as Str from '@effect/data/String';

export default flow(
  Str.split(/\r\n|\n/),
  RA.filter(P.not(Str.isEmpty)),
  constant,
);
