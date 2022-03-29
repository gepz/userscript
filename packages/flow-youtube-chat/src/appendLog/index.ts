import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray';
import {
  pipe,
} from 'fp-ts/function';

export default (log: readonly string[]) => (
  [a, ...b]: RNEA.ReadonlyNonEmptyArray<unknown>,
): string[] => pipe(
  // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
  [...log, `${a}${b.length > 0 ? ': ' : ''}${b.join(', ')}`],
  (x) => (x.length > 1000 ? x.slice(0, 100)
  : x),
);
