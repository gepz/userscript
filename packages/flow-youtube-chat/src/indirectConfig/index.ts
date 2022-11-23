import * as I from 'fp-ts/Identity';
import * as T from 'fp-ts/Task';
import {
  pipe,
} from 'fp-ts/function';

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
  I.apS('getValue', pipe(
    () => GM.getValue<T1>(key),
    T.map((x) => (x !== undefined ? toConfig(x) : defaultValue)),
  )),
);
