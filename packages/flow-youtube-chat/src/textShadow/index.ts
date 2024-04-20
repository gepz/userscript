import {
  pipe,
} from 'effect/Function';
import * as A from 'effect/Array';

export default (shadowColor: string) => (offset: number): string => pipe(
  offset,
  (x) => `${x}px`,
  (x) => (a: string, b: string) => `${a}${x} ${b}${x} ${shadowColor}99`,
  (x) => A.join(', ')([
    x('-', '-'),
    x('', '-'),
    x('-', ''),
    x('', ''),
  ]),
);
