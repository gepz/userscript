import * as P from 'fp-ts/Predicate';
import * as RA from 'fp-ts/ReadonlyArray';
import {
  flow,
  constant,
} from 'fp-ts/function';
import * as Str from 'fp-ts/string';

export default flow(
  Str.split(/\r\n|\n/),
  RA.filter(P.not(Str.isEmpty)),
  constant,
);
