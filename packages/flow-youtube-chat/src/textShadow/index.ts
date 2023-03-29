import {
  flow,
} from '@effect/data/Function';
import * as RA from '@effect/data/ReadonlyArray';

export default (shadowColor: string): (x: number) => string => flow(
  (x) => `${x}px`,
  (x) => (a: string, b: string) => `${a}${x} ${b}${x} ${shadowColor}99`,
  (x) => RA.join(', ')([
    x('-', '-'),
    x('', '-'),
    x('-', ''),
    x('', ''),
  ]),
);
