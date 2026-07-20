import {
  Effect as Z,
  Option as O,
  Schema as S,
  pipe,
} from 'effect';

import GMConfigItem from '@/GMConfigItem';

export default <T1 extends GM.Value, T2>(
  key: string,
  defaultValue: T2,
  schema: S.Schema<T1>,
  toConfig: (x: T1) => T2,
  toGm: (x: T2) => GM.Value,
): GMConfigItem<T2> => pipe(
  S.decodeUnknownOption(schema),
  (decode) => ({
    gmKey: key,
    defaultValue,
    toGm,
    // Stored values are a trust boundary (they may predate format changes):
    // anything failing the schema falls back to the default, not just
    // undefined.
    getValue: pipe(
      Z.promise(() => GM.getValue(key)),
      Z.map((x) => O.match(decode(x), {
        onNone: () => defaultValue,
        onSome: toConfig,
      })),
    ),
  }),
);
