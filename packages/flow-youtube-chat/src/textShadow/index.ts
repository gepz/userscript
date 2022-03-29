import * as R from 'fp-ts/Reader';
import {
  flow,
} from 'fp-ts/function';

export default (shadowColor: string): R.Reader<number, string> => flow(
  (x) => `${x}px`,
  (x) => (a: string, b: string) => `${a}${x} ${b}${x} ${shadowColor}99`,
  (x) => [
    x('-', '-'),
    x('', '-'),
    x('-', ''),
    x('', ''),
  ].join(', '),
);
