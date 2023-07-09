import {
  pipe,
} from '@effect/data/Function';
import * as Z from '@effect/io/Effect';

import GMConfigItem from '@/GMConfigItem';

export default <T1 extends GM.Value, T2>(
  key: string,
  defaultValue: T2,
  toConfig: (x: T1) => T2,
  toGm: (x: T2) => GM.Value,
): GMConfigItem<T2> => pipe(
  {
    gmKey: key,
    defaultValue,
    toGm,
  },
  (ctx) => ({
    ...ctx,
    getValue: pipe(
      // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
      Z.promise(() => GM.getValue(key) as Promise<T1>),
      Z.map((x) => (x !== undefined ? toConfig(x) : defaultValue)),
    ),
  }),
);
