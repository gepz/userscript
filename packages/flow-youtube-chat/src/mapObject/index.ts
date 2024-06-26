import {
  Array as A,
  pipe,
} from 'effect';

// eslint-disable-next-line @typescript-eslint/ban-types
export default <T1 extends {}, T2 extends {}>(
  f: (x: [keyof T1, T1[keyof T1]]) => readonly [keyof T2, unknown],
) => (o: T1): T2 => pipe(
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  Object.entries(o) as [(keyof T1), T1[keyof T1]][],
  A.map(f),
  Object.fromEntries,
);
