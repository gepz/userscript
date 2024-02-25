import {
  pipe,
} from 'effect/Function';
import * as RA from 'effect/ReadonlyArray';

export default (shadowColor: string) => (offset: number): string => pipe(
  offset,
  (x) => `${x}px`,
  (x) => (a: string, b: string) => `${a}${x} ${b}${x} ${shadowColor}99`,
  (x) => RA.join(', ')([
    x('-', '-'),
    x('', '-'),
    x('-', ''),
    x('', ''),
  ]),
);

