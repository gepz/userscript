import {
  Array as A,
  Struct,
  pipe,
} from 'effect';

export default <T1 extends object, T2 extends object>(
  f: (x: [keyof T1, T1[keyof T1]]) => readonly [keyof T2, unknown],
) => (o: T1): T2 => pipe(
  Struct.entries(o),
  A.map(f),
  Object.fromEntries,
);
