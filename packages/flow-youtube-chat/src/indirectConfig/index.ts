import {
  pipe,
} from '@effect/data/Function';
import * as I from '@effect/data/Identity';
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
  I.letDiscard('getValue', pipe(
    Z.promise(() => GM.getValue<T1>(key)),
    Z.map((x) => (x !== undefined ? toConfig(x) : defaultValue)),
  )),
);
