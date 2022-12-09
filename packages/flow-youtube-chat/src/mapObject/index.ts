import * as R from 'fp-ts/Reader';
import * as RA from 'fp-ts/ReadonlyArray';
import {
  pipe,
} from 'fp-ts/function';

// eslint-disable-next-line @typescript-eslint/ban-types
export default <T1 extends {}, T2 extends {}>(
  f: R.Reader<
  [keyof T1, T1[keyof T1]],
  readonly [keyof T2, unknown]>,
) => (o: T1): T2 => pipe(
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  Object.entries(o) as [(keyof T1), T1[keyof T1]][],
  RA.map(f),
  Object.fromEntries,
);
